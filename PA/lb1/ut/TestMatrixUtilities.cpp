#include <gtest/gtest.h>

#include "../MatrixGenerator.hpp"
#include "../MatrixMultiplier.hpp"

template<typename T>
bool compareMatrices(Matrix<T>&& a, Matrix<T>&& b)
{
    if (a.rows != b.rows || a.cols != b.cols)
    {
        return false;
    }

    for (int i = 0; i < a.rows; ++i)
    {
        for (int j = 0; j < a.cols; ++j)
        {
            if (a(i, j) != b(i, j))
            {
                return false;
            }
        }
    }
    return true;
}

struct TestingParam
{
    int a_rows;
    int a_cols;
    int b_rows;
    int b_cols;
};

class TestMatrixMultiplier : public testing::TestWithParam<TestingParam>
{
public:
    TestMatrixMultiplier()
        : _thread_number(8)
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
    EXPECT_THROW( multiply(Matrix<int>(3, 2), Matrix<int>(3, 5)), std::invalid_argument);
}

TEST(MatrixMultiplication, SizeMismatchMultiThread)
{
    EXPECT_THROW( multiply(Matrix<int>(3, 2), Matrix<int>(3, 5)), std::invalid_argument);
}

// Valid sizes of matrices a and b must be guaranteed by the test.
TEST_P(TestMatrixMultiplier, CompareSingleThreadedAndMultiThreadedImplementation)
{
    TestingParam testing_param = GetParam();
    Matrix a = _matrix_generator.gen(testing_param.a_rows, testing_param.a_cols, std::make_pair(-100.0, 100.0));
    Matrix b = _matrix_generator.gen(testing_param.b_rows, testing_param.b_cols, std::make_pair(-100.0, 100.0));
    
    EXPECT_TRUE(compareMatrices(multiply(a, b), multiplyConcurrently(a, b, _thread_number)));
}

INSTANTIATE_TEST_SUITE_P(
    PowerOfTwoMatrices,
    TestMatrixMultiplier,
    testing::Values(
        TestingParam {64, 64, 64, 64},
        TestingParam {128, 128, 128, 128}
    )
);

INSTANTIATE_TEST_SUITE_P(
    ArbitraryMatrices,
    TestMatrixMultiplier,
    testing::Values(
        TestingParam {35, 13, 13, 234},
        TestingParam {12, 45, 45, 54}
    )
);

int main(int argc, char **argv)
{
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();    
}