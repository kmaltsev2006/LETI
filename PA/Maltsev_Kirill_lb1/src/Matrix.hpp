#pragma once

#include <cstdint>
#include <stdexcept>


template<typename T>
class Matrix
{
public:
    explicit Matrix(int rows, int cols)
        : rows(rows)
        , cols(cols)
        , _data(new T[rows*cols]())
    {}

    explicit Matrix(const std::vector<std::vector<T>>& data)
    {
        validate(data);

        rows = data.size();
        cols = data[0].size();
        
        _data = new T[rows*cols];
        
        for (int i = 0; i < rows; ++i)
        {
            for (int j = 0; j < cols; ++j)
            {
                _data[cols * i + j] = data[i][j];
            }
        }
    }

    ~Matrix()
    {
        delete[] _data;
    }

    Matrix(const Matrix& other)
        : rows(other.rows)
        , cols(other.cols)
        , _data(new T[rows*cols])
    {
        for (int i = 0; i < rows * cols; ++i)
        {
            _data[i] = other._data[i];
        }
    }

    Matrix(Matrix&& other)
        : rows(std::exchange(other.rows, 0))
        , cols(std::exchange(other.cols, 0))
        , _data(std::exchange(other._data, nullptr))
    {}

    Matrix& operator=(Matrix& other)
    {
        if (this == &other)
        {
            return *this;
        }

        rows = other.rows;
        cols = other.cols;

        delete[] _data;
        _data = new T[other.rows * other.cols];
        std::copy(other._data, other._data + other.rows * other.cols, _data);
        
        return *this;   
    }

    Matrix& operator=(Matrix&& other)
    {
        if (this == &other)
        {
            return *this;
        }
        
        delete[] _data;
        rows = std::exchange(other.rows, 0);
        cols = std::exchange(other.cols, 0);
        _data = std::exchange(other._data, nullptr);

        return *this;
    }

    T *data()
    {
        return _data;
    }

    T& operator()(int i, int j)
    {
        return _data[cols * i + j];
    }
    
    T operator()(int i, int j) const
    {
        return _data[cols * i + j];
    }

public:
    int cols;
    int rows;

private:
    T *_data;

private:
    void validate(const std::vector<std::vector<T>>& data)
    {
        if (0 == data.size())
        {
            throw std::invalid_argument("Matrix cannot be empty");
        }

        if (0 == data[0].size())
        {
            throw std::invalid_argument("Matrix cannot be empty");
        }

        for (auto& row : data)
        {
            if (row.size() != data[0].size())
            {
                throw std::invalid_argument("Matrix cannot be jagged");
            }
        }
    }
};