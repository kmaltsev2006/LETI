#include <iostream>
#include <utility>


#include <chrono> // delete
#include <random> // delete

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

int main()
{
    MatrixGenerator matrix_generator;    
    
    auto a = matrix_generator.gen(14, 15, std::make_pair(-100.0, 100.0));
    auto b = matrix_generator.gen(15, 13, std::make_pair(-100.0, 100.0));
    
    {
        auto start = std::chrono::steady_clock::now();
        Matrix<double> c = multiply(a, b);
        auto end = std::chrono::steady_clock::now();
        std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;
        
        // for (int i = 0; i < c.rows; ++i)
        // {
        //     for (int j = 0; j < c.cols; ++j)
        //     {
        //         std::cout << c(i, j) << " ";
        //     }
        //     std::cout << std::endl;
        // }
    }
    
    {
        auto start = std::chrono::steady_clock::now();
        Matrix<double> c = multiplyConcurrently(a, b, std::thread::hardware_concurrency());
        auto end = std::chrono::steady_clock::now();
        std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;

        // for (int i = 0; i < c.rows; ++i)
        // {
        //     for (int j = 0; j < c.cols; ++j)
        //     {
        //         std::cout << c(i, j) << " ";
        //     }
        //     std::cout << std::endl;
        // }
    }
}