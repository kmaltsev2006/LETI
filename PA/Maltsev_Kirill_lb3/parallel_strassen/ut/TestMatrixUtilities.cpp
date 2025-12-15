#include <gtest/gtest.h>

#include "MatrixGenerator.hpp"
#include "MatrixMultiplier.hpp"

template<typename T>
bool compareMatrices(Matrix<T>&& c1, Matrix<T>&& c2)
{
    if (c1.rows != c2.rows || c1.cols != c2.cols)
    {
        return false;
    }

    for (int i = 0; i < c1.rows; ++i)
    {
        for (int j = 0; j < c2.cols; ++j)
        {
            if (c1(i, j) != c2(i, j))
            {
                return false;
            }
        }
    }
    return true;
}

namespace ut
{
struct Dimension
{
    int n;
    int m;
    int p;
};
};


class TestMatrixMultiplier : public testing::TestWithParam<ut::Dimension>
{
public:
    TestMatrixMultiplier()
        : _thread_number(std::thread::hardware_concurrency())
    {}

protected:
    MatrixGenerator _matrix_generator;
    int _thread_number;
};

TEST(MatrixInitialization, CompletelyEmpty)
{
    EXPECT_THROW(Matrix<int>({}), std::invalid_argument);
}

TEST(MatrixInitialization, PseudoEmpty)
{
    EXPECT_THROW(Matrix<int>({{}}), std::invalid_argument);
}

TEST(MatrixInitialization, Jagged)
{
    EXPECT_THROW(Matrix<int>({{1, 1, 1}, {2, 2}, {3, 3, 3}}), std::invalid_argument);
}

TEST(MatrixMultiplication, SizeMismatchSingleThread)
{
    Matrix<int> a(3, 2);
    Matrix<int> b(3, 5);
    EXPECT_THROW( multiply(a, b), std::invalid_argument);
}

TEST(MatrixMultiplication, SizeMismatchMultiThread)
{
    Matrix<int> a(3, 2);
    Matrix<int> b(3, 5);
    EXPECT_THROW( multiply(a, b), std::invalid_argument);
}

TEST_P(TestMatrixMultiplier, MultiplyConcurrently)
{
    ut::Dimension dim = GetParam();
    Matrix a = _matrix_generator.gen<int>(dim.n, dim.m, std::make_pair(-100.0, 100.0));
    Matrix b = _matrix_generator.gen<int>(dim.m, dim.p, std::make_pair(-100.0, 100.0));
    
    EXPECT_TRUE(compareMatrices(multiply(a, b), multiplyConcurrently(a, b, _thread_number)));
}

TEST_P(TestMatrixMultiplier, MultiplyConcurrentlyStrassen)
{
    ut::Dimension dim = GetParam();
    Matrix a = _matrix_generator.gen<int>(dim.n, dim.m, std::make_pair(-100.0, 100.0));
    Matrix b = _matrix_generator.gen<int>(dim.m, dim.p, std::make_pair(-100.0, 100.0));
    
    EXPECT_TRUE(compareMatrices(multiply(a, b), multiplyConcurrentlyStrassen(a, b, _thread_number)));
}

INSTANTIATE_TEST_SUITE_P(
    PowerOfTwoMatrices,
    TestMatrixMultiplier,
    testing::Values(
        ut::Dimension {64, 64, 64},
        ut::Dimension {128, 128, 128},
        ut::Dimension {256, 256, 256},
        ut::Dimension {512, 512, 512}
    )
);

INSTANTIATE_TEST_SUITE_P(
    ArbitraryMatrices,
    TestMatrixMultiplier,
    testing::Values(
        ut::Dimension {12, 14, 11},
        ut::Dimension {35, 13, 234},
        ut::Dimension {15, 16, 16},
        ut::Dimension {10, 10, 10},
        ut::Dimension {7, 13, 9}
    )
);

int main(int argc, char **argv)
{
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();    
}