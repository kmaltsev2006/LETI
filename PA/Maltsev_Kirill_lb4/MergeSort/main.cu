#include <cuda_runtime.h>
#include <vector>
#include <functional>
#include <cstring>
#include <iostream>
#include <chrono>
#include <algorithm>
#include <cassert>

#include "merge_sort_parallel.cu"

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

private:
    std::vector<std::function<void()>> _tests;
};

void populateTests(UT& ut, const std::vector<int>& sizes)
{
    int test_id = 1;
    for (auto size : sizes)
    {
        ut.sub([size, test_id]()
        {
            srand(time(nullptr));
            std::vector<int> v(size);

            for (int i = 0; i < size; i++)
            {
                v[i] = rand() % 100;
            }

            mergeSort(v.data(), size);
            
            assert(std::is_sorted(v.begin(), v.end()));

            std::cout << "TEST " << test_id << " PASSED" << std::endl;
        });

        test_id++;
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

void populateBenchmarks(Benchmark& benchmark, const std::vector<int>& sizes)
{
    for (auto size : sizes)
    {
        benchmark.sub([size]()
        {
            srand(time(nullptr));
            std::vector<int> v(size);

            for (int i = 0; i < size; i++)
            {
                int val = rand() % 1000000;
                v[i] = val;
            }

            auto start = std::chrono::high_resolution_clock::now();
            mergeSort(v.data(), size);
            auto end = std::chrono::high_resolution_clock::now();

            auto parallel_time = std::chrono::duration<double, std::milli>(end - start);
            std::cout << size << ": " << parallel_time.count()/10 << "ms" << std::endl;
        });
    }
}

int main()
{
    UT ut;
    populateTests(ut, {2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048});
    ut.runTests();

    std::vector<int> v; for (int i = 100000; i <= 2000000; i += 100000) v.push_back(i);
    Benchmark benchmark;
    populateBenchmarks(benchmark, v);
    benchmark.runBenchmarks();

    return 0;
}