#pragma once

#include "Matrix.hpp"
#include "ThreadPool.hpp"

struct Dimension
{
    int n;
    int m;
    int p;
};

template<typename T>
static void multiplyBlocksRaw(T *a, T *b, T *c, 
    int block_i, int block_j, int block_size, int phase,
    Dimension dim)
{
    // If we come across a pseudo-block, we skip it.
    if (block_i * block_size >= dim.n || block_j * block_size >= dim.p)
    {
        return;
    }

    for (int i = 0; i < block_size; ++i)
    {
        for (int j = 0; j < block_size; ++j)
        {
            for (int k = 0; k < block_size; ++k)
            {
                int c_i = block_i * block_size + i;
                int c_j = block_j * block_size + j;
                int a_i = block_i * block_size + i;
                int a_j = phase * block_size + k;
                int b_i = phase * block_size + k;
                int b_j = block_j * block_size + j;

                if (c_i >= dim.n || c_j >= dim.p || 
                    a_i >= dim.n || a_j >= dim.m || 
                    b_i >= dim.m || b_j >= dim.p)
                {
                    continue;
                }

                c[dim.p * c_i + c_j] += a[dim.m * a_i + a_j] * b[dim.p * b_i + b_j];
            }
        }
    }
}

template<typename T>
Matrix<T> multiplyConcurrently(Matrix<T>& a, Matrix<T>& b, int threads_count)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    Matrix<T> c(a.rows, b.cols);

    int size = 1;
    while (size < std::max(std::max(a.rows, a.cols), std::max(b.rows, b.cols))) 
    {
        size *= 2;
    }
    int block_size = 16; // TODO: calculate it somehow
    
    {
        // calculation attempt
        int block_sise = 1;
        // thread must take at least 3.125% (100 / 8 / 2 / 2)
        while (block_size < size && threads_count / static_cast<double>((size*size) / (block_sise*block_sise)) < 0.3125)
        {
            size *= 2;
        }
    }
    
    int phase_count = size / block_size; // TODO: check division

    {
        ThreadPool thread_pool(threads_count);

        for (int block_i = 0; block_i < phase_count; ++block_i)
        {
            for (int block_j = 0; block_j < phase_count; ++block_j)
            {
                thread_pool.enqueue([&a, &b, &c, block_i, block_j, block_size, phase_count](){
                    for (int phase = 0; phase < phase_count; ++phase)
                    {
                        multiplyBlocksRaw(a.data(), b.data(), c.data(), 
                            block_i, block_j, block_size, phase, 
                            Dimension{a.rows, a.cols, b.cols});
                    }
                });
            }
        }
    }

    return c;
}

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

template <typename T>
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