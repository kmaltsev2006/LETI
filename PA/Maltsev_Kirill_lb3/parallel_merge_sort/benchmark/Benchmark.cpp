#include <benchmark/benchmark.h>

#include "task_parallel_merge_sort.hpp"
#include "dnc_parallel_merge_sort.hpp"
#include "GenVec.hpp"
#include "merge_sort.hpp"

extern const int ITERATIONS = 1;

class BenchmarkParallelMerge : public benchmark::Fixture
{
public:

    void SetUp(const benchmark::State& state) override
    {
        size_t size = state.range(0);
        v_ptr = std::make_shared<std::vector<int>>(_gen_vec(size));
    }

protected:
    std::shared_ptr<std::vector<int>> v_ptr;

private:
    GenVec _gen_vec;
};

BENCHMARK_DEFINE_F(BenchmarkParallelMerge, MergeSort)(benchmark::State& state)
{
    for (auto _ : state)
    {
        mergeSort(*v_ptr);
    }
}

BENCHMARK_DEFINE_F(BenchmarkParallelMerge, DnCParallelMergeSort)(benchmark::State& state)
{
    for (auto _ : state)
    {
        dncParallelMergeSort(*v_ptr);
    }
}

BENCHMARK_DEFINE_F(BenchmarkParallelMerge, TaskParallelMergeSort)(benchmark::State& state)
{
    for (auto _ : state)
    {
        taskParallelMergeSort(*v_ptr);
    }
}

BENCHMARK_REGISTER_F(BenchmarkParallelMerge, MergeSort)
    ->DenseRange(1000000, 10000000, 200000)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkParallelMerge, DnCParallelMergeSort)
    ->DenseRange(1000000, 10000000, 200000)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_REGISTER_F(BenchmarkParallelMerge, TaskParallelMergeSort)
    ->DenseRange(1000000, 10000000, 200000)
    ->Iterations(ITERATIONS)
    ->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();