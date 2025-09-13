#include <benchmark/benchmark.h>
#include <iostream> // delete
#include <chrono> // delete

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

MatrixGenerator matrix_generator;

class MatrixFixture : public benchmark::Fixture
{
public:
    void SetUp(const benchmark::State& state) override
    {
        int size = state.range(0);
        a_ptr = std::make_shared<Matrix<double>>(matrix_generator.gen(size, size, std::make_pair(-100.0, 100.0)));
        b_ptr = std::make_shared<Matrix<double>>(matrix_generator.gen(size, size, std::make_pair(-100.0, 100.0)));
    }

protected:
    std::shared_ptr<Matrix<double>> a_ptr;
    std::shared_ptr<Matrix<double>> b_ptr;

private:
    MatrixGenerator matrix_generator;
};

BENCHMARK_DEFINE_F(MatrixFixture, Multiply)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiply(*a_ptr, *b_ptr);
    }
}

BENCHMARK_DEFINE_F(MatrixFixture, MultiplyConcurrently)(benchmark::State& state)
{
    for (auto _ : state)
    {
        const auto now = std::chrono::system_clock::now();
        const std::time_t t_c = std::chrono::system_clock::to_time_t(now);
        multiplyConcurrently(*a_ptr, *b_ptr, 8);
    }
}

BENCHMARK_REGISTER_F(MatrixFixture, Multiply)
    ->DenseRange(16, 256, 16)
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(MatrixFixture, MultiplyConcurrently)
    ->DenseRange(16, 256, 16)
    ->Iterations(10)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();