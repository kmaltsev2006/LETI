#pragma once

#include <cstring>
#include <future>

#include "Matrix.hpp"
#include "ThreadPool.hpp"

struct Dimension
{
    int n;
    int m;
    int p;
};

template<typename T>
static void multiplyRaw(T *a, T *b, T *c, Dimension dim)
{
    for (int i = 0; i < dim.n; ++i)
    {
        for (int j = 0; j < dim.p; ++j)
        {
            for (int k = 0; k < dim.m; ++k)
            {
                c[dim.p * i + j] += a[dim.m * i + k] * b[dim.p * k + j];
            }
        }
    }
}

template<typename T>
Matrix<T> multiply(Matrix<T>& a, Matrix<T>& b)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    
    Matrix<T> c(a.rows, b.cols);
    
    multiplyRaw(a.data(), b.data(), c.data(), Dimension{a.rows, a.cols, b.cols});

    return c;
}

template<typename T>
void extractTile(T *dst, T *src, int t_i, int t_j, int t_size, int n, int m)
{
    int max_i = std::max(0, std::min(t_size, n - t_i * t_size));
    int max_j = std::max(0, std::min(t_size, m - t_j * t_size));

    for (int i = 0; i < max_i; ++i)
    {
        int row = t_i * t_size + i;
        int src_offset = row * m + t_j * t_size;
        int dst_offset = i * t_size;

        std::memcpy(dst + dst_offset, src + src_offset, max_j * sizeof(T));
    }
}

template<typename T>
void writeTile(T* dst, const T *src, int t_i, int t_j, int t_size, int n, int m)
{
    int max_i = std::max(0, std::min(t_size, n - t_i * t_size));
    int max_j = std::max(0, std::min(t_size, m - t_j * t_size));

    for (int i = 0; i < max_i; ++i)
    {
        int row = t_i * t_size + i;
        int dst_offset = row * m + t_j * t_size;
        int src_offset = i * t_size;

        std::memcpy(dst + dst_offset, src + src_offset, max_j * sizeof(T));
    }
}

int powerOfTwoSize(int a_rows, int a_cols, int b_rows, int b_cols)
{
    int size = 1;
    while (size < std::max(std::max(a_rows, a_cols), std::max(b_rows, b_cols))) 
    {
        size <<= 1;
    }
    return size;
}

int tSize(int size)
{
    int t_size = 1;
    while (t_size < size && 8.0 / double((size*size)/(t_size*t_size)) < 0.03125)
    {
        t_size <<= 1;
    }
    return t_size;
}

template<typename T>
Matrix<T> multiplyConcurrently(Matrix<T>& a, Matrix<T>& b, int threads_count)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    Matrix<T> c(a.rows, b.cols);

    
    int size = powerOfTwoSize(a.rows, a.cols, b.rows, b.cols);
    int t_size = tSize(size);
    int phase_count = size / t_size;

    {
        ThreadPool thread_pool(threads_count);

        for (int t_i = 0; t_i < phase_count; ++t_i)
        {
            for (int t_j = 0; t_j < phase_count; ++t_j)
            {
                // If we come across a pseudo-block, we skip it.
                if (t_i * t_size >= c.rows || t_j * t_size >= c.cols)
                {
                    continue;
                }
                thread_pool.enqueue([&a, &b, &c, t_i, t_j, t_size, phase_count](){
                    
                    T *c_tile = new T[t_size * t_size]();

                    for (int phase = 0; phase < phase_count; ++phase)
                    {
                        T *a_tile = new T[t_size * t_size]();
                        T *b_tile = new T[t_size * t_size]();

                        extractTile(a_tile, a.data(), t_i, phase, t_size, a.rows, a.cols);
                        extractTile(b_tile, b.data(), phase, t_j, t_size, b.rows, b.cols);
                        multiplyRaw(a_tile, b_tile, c_tile, Dimension{t_size, t_size, t_size});

                        delete[] a_tile;
                        delete[] b_tile;
                    }
                    writeTile(c.data(), c_tile, t_i, t_j, t_size, c.rows, c.cols);

                    delete[] c_tile;
                });
            }
        }
    }

    return c;
}

template<typename T>
Matrix<T> multiplyAsync(Matrix<T>& a, Matrix<T>& b)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    Matrix<T> c(a.rows, b.cols);

    
    int size = powerOfTwoSize(a.rows, a.cols, b.rows, b.cols);
    int t_size = tSize(size);
    int phase_count = size / t_size;


    std::vector<std::future<void>> tiles;
    for (int t_i = 0; t_i < phase_count; ++t_i)
    {
        for (int t_j = 0; t_j < phase_count; ++t_j)
        {
            // If we come across a pseudo-block, we skip it.
            if (t_i * t_size >= c.rows || t_j * t_size >= c.cols)
            {
                continue;
            }

            tiles.emplace_back(std::async(std::launch::async | std::launch::deferred, [&a, &b, &c, t_i, t_j, t_size, phase_count](){
                T *c_tile = new T[t_size * t_size]();
                for (int phase = 0; phase < phase_count; ++phase)
                {
                    T *a_tile = new T[t_size * t_size]();
                    T *b_tile = new T[t_size * t_size]();

                    extractTile(a_tile, a.data(), t_i, phase, t_size, a.rows, a.cols);
                    extractTile(b_tile, b.data(), phase, t_j, t_size, b.rows, b.cols);
                    multiplyRaw(a_tile, b_tile, c_tile, Dimension{t_size, t_size, t_size});

                    delete[] a_tile;
                    delete[] b_tile;
                }
                writeTile(c.data(), c_tile, t_i, t_j, t_size, c.rows, c.cols);
                delete[] c_tile;
            }));
        }
    }

    for (auto& tile : tiles)
    {
        tile.get();
    }

    return c;
}