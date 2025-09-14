#include <benchmark/benchmark.h>
#include <iostream> // delete
#include <chrono> // delete

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

MatrixGenerator matrix_generator;

class BenchmarkMatrixMultiplier : public benchmark::Fixture
{
public:
    BenchmarkMatrixMultiplier()
        : _thread_number(8)
    {}

    void SetUp(const benchmark::State& state) override
    {
        int size = state.range(0);
        a_ptr = std::make_shared<Matrix<double>>(_matrix_generator.gen(size, size, std::make_pair(-100.0, 100.0)));
        b_ptr = std::make_shared<Matrix<double>>(_matrix_generator.gen(size, size, std::make_pair(-100.0, 100.0)));
    }

protected:
    std::shared_ptr<Matrix<double>> a_ptr;
    std::shared_ptr<Matrix<double>> b_ptr;
    int _thread_number;

private:
    MatrixGenerator _matrix_generator;
};

BENCHMARK_DEFINE_F(BenchmarkMatrixMultiplier, Multiply)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiply(*a_ptr, *b_ptr);
    }
}

BENCHMARK_DEFINE_F(BenchmarkMatrixMultiplier, MultiplyConcurrently)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiplyConcurrently(*a_ptr, *b_ptr, _thread_number);
    }
}

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, Multiply)
    ->DenseRange(16, 1024, 16)
    ->Iterations(16)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, MultiplyConcurrently)
    ->DenseRange(16, 1024, 16)
    ->Iterations(16)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();