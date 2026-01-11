#pragma once

#include "Matrix.hpp"

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