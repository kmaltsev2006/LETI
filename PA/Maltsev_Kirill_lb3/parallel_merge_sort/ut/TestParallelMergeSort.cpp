#include <gtest/gtest.h>
#include <random>
#include <algorithm>

#include "dnc_parallel_merge_sort.hpp"
#include "task_parallel_merge_sort.hpp"
#include "GenVec.hpp"


class TestParallelMergeSort : public testing::TestWithParam<size_t>
{
protected:
    GenVec _gen_vec;
};

TEST_P(TestParallelMergeSort, DnCParallelMergeSort)
{
    size_t size = GetParam();
    std::vector<int> v = _gen_vec(size);
    dncParallelMergeSort(v);
    EXPECT_TRUE(std::is_sorted(v.begin(), v.end()));
}

TEST_P(TestParallelMergeSort, TaskParallelMergeSort)
{
    size_t size = GetParam();
    std::vector<int> v = _gen_vec(size);
    taskParallelMergeSort(v);
    EXPECT_TRUE(std::is_sorted(v.begin(), v.end()));
}

INSTANTIATE_TEST_SUITE_P(
    AllCases,
    TestParallelMergeSort,
    testing::Values(0, 1, 2, 3, 1024, 2048, 8192)
);

int main(int argc, char **argv)
{
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();    
}