cmake_minimum_required(VERSION 3.20)

project(TestMatrixUtilities)

set(CMAKE_CXX_STANDART 17)
set(CMAKE_CXX_REQUIRED True)

add_subdirectory(googletest)
add_executable(${PROJECT_NAME} TestMatrixUtilities.cpp)

include_directories(googletest/googletest/include ../src)
target_link_libraries(${PROJECT_NAME} gtest)