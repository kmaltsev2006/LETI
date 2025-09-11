#include <cassert>
#include <iostream> // delete

#include "Matrix.h"

template <typename value_t>
Matrix<value_t> multiply(Matrix<value_t>& a, Matrix<value_t>& b)
{
    Matrix<value_t> c(a.row, b.col);

    for (int i = 0; i < a.row; ++i)
    {
        for (int j = 0; j < b.col; ++j)
        {
            for (int k = 0; k < a.col; ++k)
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
    for (int i = 0; i < c.row; ++i)
    {
        for (int j = 0; j < c.col; ++j)
        {
            std::cout << c(i, j) << " ";
        }
        std::cout << std::endl;
    }

}