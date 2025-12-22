#include <benchmark/benchmark.h>

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

extern const int ITERATIONS = 1;

class BenchmarkMatrixMultiplier : public benchmark::Fixture
{
public:
    BenchmarkMatrixMultiplier()
        : _thread_number(std::thread::hardware_concurrency())
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

BENCHMARK_DEFINE_F(BenchmarkMatrixMultiplier, MultiplyStrassen)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiplyStrassen(*a_ptr, *b_ptr);
    }
}

BENCHMARK_DEFINE_F(BenchmarkMatrixMultiplier, MultiplyConcurrently)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiplyConcurrently(*a_ptr, *b_ptr, _thread_number);
    }
}

BENCHMARK_DEFINE_F(BenchmarkMatrixMultiplier, MultiplyConcurrentlyStrassen)(benchmark::State& state)
{
    for (auto _ : state)
    {
        multiplyConcurrentlyStrassen(*a_ptr, *b_ptr, _thread_number);
    }
}

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, Multiply)
    ->DenseRange(128, 1024, 128)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, MultiplyStrassen)
    ->DenseRange(128, 1024, 128)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, MultiplyConcurrently)
    ->DenseRange(128, 1024, 128)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkMatrixMultiplier, MultiplyConcurrentlyStrassen)
    ->DenseRange(128, 1024, 128)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();