#include <iostream>
#include <utility>
#include <chrono> // delete
#include <random> // delete

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

int main()
{
    // {
    //     ThreadPool tp(10);
        
    //     std::random_device rd;
    //     std::mt19937 gen(rd());
    //     std::uniform_int_distribution<> distrib(1, 5);

    //     for (int i=0; i<10; ++i)
    //     {
    //         tp.enqueue([i, &distrib, &gen](){
    //             int sec = distrib(gen);
    //             std::this_thread::sleep_for(std::chrono::seconds(sec));
    //             std::cout << i << " " << sec << std::endl;
    //         });
    //     }

    //     std::cout << "DBG 1\n";
    // }
    

    // std::cout << "DBG 2\n";

    // std::cout << "DBG end\n";
    
    MatrixGenerator matrix_generator;
    // auto a = matrix_generator.gen(64, 64, std::make_pair(-100.0, 100.0));
    // auto b = matrix_generator.gen(64, 64, std::make_pair(-100.0, 100.0));
    

    // auto a = matrix_generator.gen(2, 3, std::make_pair(-100.0, 100.0));
    // auto b = matrix_generator.gen(3, 3, std::make_pair(-100.0, 100.0));
    
    auto a = matrix_generator.gen(512, 2048, std::make_pair(-100.0, 100.0));
    auto b = matrix_generator.gen(2048, 512, std::make_pair(-100.0, 100.0));
    
    {
        auto start = std::chrono::steady_clock::now();
        auto c1 = multiply(a, b);
        auto end = std::chrono::steady_clock::now();
        std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;
        
        // for (int i = 0; i < c1.rows; ++i)
        // {
        //     for (int j = 0; j < c1.cols; ++j)
        //     {
        //         std::cout << c1(i, j) << " ";
        //     }
        //     std::cout << std::endl;
        // }
    }
    
    std::cout << "DBG line\n";

    {
        auto start = std::chrono::steady_clock::now();
        auto c2 = multiplyConcurrently(a, b, 8);
        auto end = std::chrono::steady_clock::now();
        std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;
        
        // for (int i = 0; i < c2.rows; ++i)
        // {
        //     for (int j = 0; j < c2.cols; ++j)
        //     {
        //         std::cout << c2(i, j) << " ";
        //     }
        //     std::cout << std::endl;
        // }
    }
}