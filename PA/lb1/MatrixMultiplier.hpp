#pragma once

#include "Matrix.hpp"
#include "ThreadPool.hpp"

template<typename T>
static void multiplyBlocks(T *a, T *b, T *c, 
    int block_i, int block_j, int block_size, int phase,
    int n, int m, int p)
{
    // If we come across a pseudo-block, we skip it.
    if (block_i * block_size >= n || block_j * block_size >= p)
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

                if (c_i >= n || c_j >= p || 
                    a_i >= n || a_j >= m || 
                    b_i >= m || b_j >= p)
                {
                    continue;
                }
                
                c[c_i * n + c_j] += a[a_i * n + a_j] * b[b_i * m + b_j];
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
    
    int n = a.rows;
    int m = a.cols;
    int p = b.cols;

    T* _a = a.data();
    T* _b = b.data();
    T* _c = c.data();

    int size = 1;
    while (size < std::max(std::max(a.rows, a.cols), std::max(b.rows, b.cols))) 
    {
        size *= 2;
    }
    int block_size = 128; // TODO: calculate it somehow
    int phase_count = size / block_size; // TODO: check division

    {
        ThreadPool thread_pool(threads_count);

        for (int block_i = 0; block_i < phase_count; ++block_i)
        {
            for (int block_j = 0; block_j < phase_count; ++block_j)
            {
                thread_pool.enqueue([_a, _b, _c, block_i, block_j, block_size, phase_count, n, m, p](){
                    for (int phase = 0; phase < phase_count; ++phase)
                    {
                        multiplyBlocks(_a, _b, _c, block_i, block_j, block_size, phase, n, m, p);
                    }
                });
            }
        }
    }

    return c;
}

template <typename T>
Matrix<T> multiply(const Matrix<T>& a, const Matrix<T>& b)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    
    Matrix<T> c(a.rows, b.cols);

    for (int i = 0; i < a.rows; ++i)
    {
        for (int j = 0; j < b.cols; ++j)
        {
            for (int k = 0; k < a.cols; ++k)
            {
                c(i, j) += a(i, k) * b(k, j);
            }
        }
    }

    return c;
}