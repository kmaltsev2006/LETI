#include <stdlib.h>
#include <vector>
#include <functional>
#include <cstring>
#include <iostream>
#include <chrono>

#include "MatrixGenerator.hpp"
#include "multiply_parallel.cu"
#include "multiply.hpp"

#define GEN_INTERVAL {-100, 100}

class UT
{
public:

    void sub(const std::function<void()>& test)
    {
        _tests.push_back(test);
    }

    void runTests()
    {
        for (auto& test : _tests)
        {
            test();
        }
    }

    MatrixGenerator& matrixGenerator()
    {
        return _matrix_generator;
    }

private:
    std::vector<std::function<void()>> _tests;
    MatrixGenerator _matrix_generator;
};

void populateTests(UT& ut, const std::vector<std::tuple<int, int, int>>& dimensions)
{   
    id_t test_id = 1;
    for (auto& d : dimensions)
    {
        int N = std::get<0>(d);
        int M = std::get<1>(d);
        int K = std::get<2>(d);
        
        MatrixGenerator& matrix_generator = ut.matrixGenerator();
        
        ut.sub([N, M, K, test_id, &matrix_generator](){
            
            auto A = Matrix<float>(N, M); matrix_generator.fastGen(A.data(), A.rows, A.cols, GEN_INTERVAL);
            auto B = Matrix<float>(M, K); matrix_generator.fastGen(B.data(), B.rows, B.cols, GEN_INTERVAL);
            
            auto C1 = multiply(A, B);

            auto C2 = Matrix<float>(N, K);
            multiply_parallel(A.data(), B.data(), C2.data(), N, M, K);

            assert(0 == std::memcmp(C1.data(), C2.data(), N * K));
            
            std::cout << "TEST " << test_id << " PASSED" << std::endl;
        });

        ++test_id;
    }

}

class Benchmark
{
public:

    void sub(const std::function<void()>& benchmark)
    {
        _benchmarks.push_back(benchmark);
    }

    void runBenchmarks()
    {
        for (auto& benchmark : _benchmarks)
        {
            benchmark();
        }
    }

private:
    std::vector<std::function<void()>> _benchmarks;
};

void populateBenchmarks(Benchmark& benchmark, const std::vector<std::tuple<int, int, int>>& dimensions)
{   
    for (auto& d : dimensions)
    {
        int N = std::get<0>(d);
        int M = std::get<1>(d);
        int K = std::get<2>(d);
        
        
        benchmark.sub([N, M, K](){
            
            auto A = Matrix<float>(N, M);
            auto B = Matrix<float>(M, K);
            auto C = Matrix<float>(N, K);
            
            auto start = std::chrono::high_resolution_clock::now();
            multiply_parallel(A.data(), B.data(), C.data(), N, M, K);
            auto end = std::chrono::high_resolution_clock::now();

            std::chrono::duration<double, std::milli> time = end - start;
            std::cout << N << " " << M << " " << K << ": " << time.count() << "ms" << std::endl;

        });

    }

}

int main(int argc, char const *argv[])
{
    deviceProperties();

    UT ut;
    populateTests(ut, {
        {64, 64, 64},
        {35, 13, 234},
        {128, 128, 128},
        {256, 256, 256},
        {1024, 1024, 1024},
    });
    ut.runTests();

    Benchmark benchmark;
    populateBenchmarks (benchmark, {
        {1, 1, 1},
        {2, 2, 2},
        {4, 4, 4},
        {8, 8, 8},
        {16, 16, 16},
        {32, 32, 32},
        {64, 64, 64},
        {128, 128, 128},
        {256, 256, 256},
        {512, 512, 512},
        {1024, 1024, 1024},
        {2048, 2048, 2048},
        {4096, 4096, 4096},
        {8192, 8192, 8192},
    });
    benchmark.runBenchmarks();

    return 0;
}