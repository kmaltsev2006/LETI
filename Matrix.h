#include <vector>
#include <cstdint>

template<typename value_t>
class Matrix
{
public:
    explicit Matrix(int32_t row, int32_t col)
        : row(row)
        , col(col)
    {
        _data.assign(row, std::vector<value_t>(col, 0.0));
    }

    explicit Matrix(const std::vector<std::vector<value_t>>&& data)
        : _data(data)
        , row(data.size())
        , col(data[0].size())
    {}

    ~Matrix() = default;

    value_t& operator()(int i, int j)
    {
        return _data[i][j];
    }

public:
    int32_t col;
    int32_t row;

private:
    std::vector<std::vector<value_t>> _data;
};