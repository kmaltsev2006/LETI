#include <cassert>
#include <iostream> // delete

#include "Matrix.hpp"

template <typename T>
Matrix<T> multiply(const Matrix<T>& a, const Matrix<T>& b)
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


int main()
{
    Matrix<double> a ({
        {2, -3, 1},
        {5, 4, -2}
    });
    
    Matrix<double> b ({
        {-7, 5},
        {2, -1},
        {4, 3}
    });

    Matrix c = multiply(a, b);
    for (int i = 0; i < c.rows; ++i)
    {
        for (int j = 0; j < c.cols; ++j)
        {
            std::cout << c(i, j) << " ";
        }
        std::cout << std::endl;
    }

}