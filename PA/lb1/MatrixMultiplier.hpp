#pragma once

#include "Matrix.hpp"
#include "ThreadPool.hpp"

template<typename T>
void multiplyBlocks(const Matrix<T>& a, const Matrix<T>& b, Matrix<T>&c,
     int block_i, int block_j, int block_size, int phase_num)
{
    // If we come across a pseudo-block, we skip it.
    if (block_i * block_size >= c.rows || block_j * block_size >= c.cols)
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
                int a_j = phase_num * block_size + k;
                int b_i = phase_num * block_size + k;
                int b_j = block_j * block_size + j;

                if (c_i >= c.rows || c_j >= c.cols || 
                    a_i >= a.rows || a_j >= a.cols || 
                    b_i >= b.rows || b_j >= b.cols)
                {
                    continue;
                }
                
                c(c_i, c_j) += a(a_i, a_j) * b(b_i, b_j);
            }
        }
    }
}

template<typename T>
Matrix<T> multiplyConcurrently(const Matrix<T>& a, const Matrix<T>& b, int threads_count)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    Matrix<double> c(a.rows, b.cols);
    
    int n = 1;
    while (n < std::max(std::max(a.rows, a.cols), std::max(b.rows, b.cols))) 
    {
        n *= 2;
    }
    int block_size = 64; // TODO: calculate it somehow

    int phase = n / block_size; // TODO: check division

    {
        ThreadPool thread_pool(threads_count);

        for (int block_i = 0; block_i < phase; ++block_i)
        {
            for (int block_j = 0; block_j < phase; ++block_j)
            {
                thread_pool.enqueue([&a, &b, &c, block_i, block_j, block_size, phase](){
                    for (int phase_num = 0; phase_num < phase; ++phase_num)
                    {
                        multiplyBlocks(a, b, c, block_i, block_j, block_size, phase_num);
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