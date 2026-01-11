cmake_minimum_required(VERSION 3.20)

project(main)

set(CMAKE_CXX_STANDART 17)
set(CMAKE_CXX_REQUIRED True)
set(BENCHMARK_ENABLE_GTEST_TESTS OFF)

add_subdirectory(benchmark)
add_subdirectory(ut)

add_executable(${PROJECT_NAME} main.cpp)

include_directories(src)