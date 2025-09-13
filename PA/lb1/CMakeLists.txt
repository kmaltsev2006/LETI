cmake_minimum_required(VERSION 3.20)

project(BenchmarkMatrixUtilities)

set(CMAKE_CXX_STANDART 17)
set(CMAKE_CXX_REQUIRED True)

enable_testing()
add_subdirectory(benchmark)
add_executable(${PROJECT_NAME} Benchmark.cpp)

include_directories("benchmark/include")
target_link_libraries(${PROJECT_NAME} benchmark)