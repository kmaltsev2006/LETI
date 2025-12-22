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
Matrix<T> multiplyStrassen(Matrix<T>& a, Matrix<T>& b)
{
    if (a.cols != b.rows)
    {
        throw std::invalid_argument("Size mismatch");
    }
    
    Matrix<T> c(a.rows, b.cols);
    
    multiplyRawStrassen(a.data(), b.data(), c.data(), Dimension{a.rows, a.cols, b.cols});

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

template<typename T>
static void add(T* a, T* b, T* c, int n) {
    for (int i = 0; i < n * n; i++) c[i] = a[i] + b[i];
}

template<typename T>
static void subtract(T* a, T* b, T* c, int n) {
    for (int i = 0; i < n * n; i++) c[i] = a[i] - b[i];
}

template<typename T>
static void multiplyRawStrassen(T* a, T* b, T* c, Dimension dim) {
    int n = dim.n;
    
    if (n == 1) {
        c[0] += a[0] * b[0];
        return;
    }
    
    if (n <= 64) {
        multiplyRaw(a, b, c, dim);
        return;
    }

    int newSize = n / 2;
    int total = newSize * newSize;
    
    T* a11 = new T[total](); T* a12 = new T[total](); T* a21 = new T[total](); T* a22 = new T[total]();
    T* b11 = new T[total](); T* b12 = new T[total](); T* b21 = new T[total](); T* b22 = new T[total]();
    T* c11 = new T[total](); T* c12 = new T[total](); T* c21 = new T[total](); T* c22 = new T[total]();
    
    T* m1 = new T[total](); T* m2 = new T[total](); T* m3 = new T[total](); T* m4 = new T[total]();
    T* m5 = new T[total](); T* m6 = new T[total](); T* m7 = new T[total]();
    
    T* tempA = new T[total](); T* tempB = new T[total]();
    
    for (int i = 0; i < newSize; i++) {
        for (int j = 0; j < newSize; j++) {
            int idx = i * newSize + j;
            a11[idx] = a[i * n + j];
            a12[idx] = a[i * n + j + newSize];
            a21[idx] = a[(i + newSize) * n + j];
            a22[idx] = a[(i + newSize) * n + j + newSize];
            
            b11[idx] = b[i * n + j];
            b12[idx] = b[i * n + j + newSize];
            b21[idx] = b[(i + newSize) * n + j];
            b22[idx] = b[(i + newSize) * n + j + newSize];
        }
    }
    
    add(a11, a22, tempA, newSize); add(b11, b22, tempB, newSize);
    multiplyRawStrassen(tempA, tempB, m1, {newSize, newSize, newSize});
    
    add(a21, a22, tempA, newSize);
    multiplyRawStrassen(tempA, b11, m2, {newSize, newSize, newSize});
    
    subtract(b12, b22, tempB, newSize);
    multiplyRawStrassen(a11, tempB, m3, {newSize, newSize, newSize});
    
    subtract(b21, b11, tempB, newSize);
    multiplyRawStrassen(a22, tempB, m4, {newSize, newSize, newSize});
    
    add(a11, a12, tempA, newSize);
    multiplyRawStrassen(tempA, b22, m5, {newSize, newSize, newSize});
    
    subtract(a21, a11, tempA, newSize); add(b11, b12, tempB, newSize);
    multiplyRawStrassen(tempA, tempB, m6, {newSize, newSize, newSize});
    
    subtract(a12, a22, tempA, newSize); add(b21, b22, tempB, newSize);
    multiplyRawStrassen(tempA, tempB, m7, {newSize, newSize, newSize});
    
    // c11 = m1 + m4 - m5 + m7
    add(m1, m4, tempA, newSize);
    subtract(tempA, m5, tempB, newSize);
    add(tempB, m7, c11, newSize);
    
    // c12 = m3 + m5
    add(m3, m5, c12, newSize);
    
    // c21 = m2 + m4
    add(m2, m4, c21, newSize);
    
    // c22 = m1 - m2 + m3 + m6
    add(m1, m3, tempA, newSize);
    subtract(tempA, m2, tempB, newSize);
    add(tempB, m6, c22, newSize);
    
    for (int i = 0; i < newSize; i++) {
        for (int j = 0; j < newSize; j++) {
            int idx = i * newSize + j;
            c[i * n + j] += c11[idx];
            c[i * n + j + newSize] += c12[idx];
            c[(i + newSize) * n + j] += c21[idx];
            c[(i + newSize) * n + j + newSize] += c22[idx];
        }
    }
    
    delete[] a11; delete[] a12; delete[] a21; delete[] a22;
    delete[] b11; delete[] b12; delete[] b21; delete[] b22;
    delete[] c11; delete[] c12; delete[] c21; delete[] c22;
    delete[] m1; delete[] m2; delete[] m3; delete[] m4; delete[] m5; delete[] m6; delete[] m7;
    delete[] tempA; delete[] tempB;
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
Matrix<T> multiplyConcurrentlyStrassen(Matrix<T>& a, Matrix<T>& b, int threads_count)
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
                        multiplyRawStrassen(a_tile, b_tile, c_tile, Dimension{t_size, t_size, t_size});

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