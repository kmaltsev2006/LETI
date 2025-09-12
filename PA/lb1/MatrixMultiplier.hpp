#pragma once

#include "Matrix.hpp"
#include "ThreadPool.hpp"

template<typename T>
void multiplyBlocks(Matrix<T>& a, Matrix<T>& b, Matrix<T>&c, int block_i, int block_j, int block_size, int phase_num)
{
    // TODO: add condition for not calculating

    for (int i = 0; i < block_size; ++i) {
        for (int j = 0; j < block_size; ++j) {
            for (int k = 0; k < block_size; ++k) {
                c(block_i*block_size+i, block_j*block_size+j) += 
                    a(block_i*block_size+i, phase_num*block_size+k) * b(phase_num*block_size+k, block_j*block_size+j); // magic mafs
            }
        }
    }
}

template<typename T>
Matrix<T> multiplyConcurrently(Matrix<T>& a, Matrix<T>& b, int threads_count)
{
    Matrix<double> c(a.rows, b.cols);
    
    int n = 1;
    while (n < std::max(std::max(a.rows, a.cols), std::max(b.rows, b.cols))) 
    {
        n *= 2;
    }
    int block_size = 16; // TODO: calculate it somehow

    int phase = n/block_size; // TODO: check division

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
Matrix<T> multiply(Matrix<T>& a, Matrix<T>& b)
{
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