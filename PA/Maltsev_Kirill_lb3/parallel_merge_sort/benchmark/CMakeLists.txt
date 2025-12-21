cmake_minimum_required(VERSION 3.20)

project(BenchmarkParallelMerge)

set(CMAKE_CXX_STANDART 20)
set(CMAKE_CXX_REQUIRED True)
set(BENCHMARK_ENABLE_GTEST_TESTS OFF)

add_subdirectory(benchmark)
add_executable(${PROJECT_NAME} Benchmark.cpp)

target_include_directories(${PROJECT_NAME} PRIVATE 
    ../task_parallel_merge_sort/boost_1_89_0
    ../dnc_parallel_merge_sort
    ../task_parallel_merge_sort
    ../)

target_link_libraries(${PROJECT_NAME} benchmark)