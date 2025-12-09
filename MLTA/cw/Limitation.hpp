#pragma once

#include <bdd.h>
#include <cmath>

#include "Splice.hpp"

namespace mlta
{

class Limitation
{
public:
    Limitation()
        : _solution{nullptr}
    {}

    virtual ~Limitation() = default;

    virtual void apply() = 0;

    void sub(bdd *solution)
    {
        _solution = solution;
    }

protected:
    bdd *_solution;
};


class Lim1 : public Limitation
{
public:
    explicit Lim1(bdd ***p, int k, int i, int j)
        : _p{p}, _k{k}, _i{i}, _j{j}
    {}

    ~Lim1() override = default;
    
    void apply() override
    {
        if (!_solution) { std::abort(); }
        *_solution &= _p[_k][_i][_j];
    }

private:
    bdd ***_p;
    int _k; int _i; int _j;
};


class Lim2 : public Limitation
{
public:
    explicit Lim2(bdd ***p, int n, int k1, int k2, int j1, int j2)
        : _p{p}, _n{n}, _k1{k1}, _k2{k2}, _j1{j1}, _j2{j2}
    {}

    ~Lim2() override = default;

    void apply() override
    {
        if (!_solution) { std::abort(); }

        for (int i = 0; i < _n; ++i)
        {
            bdd a = _p[_k1][i][_j1];
            bdd b = _p[_k2][i][_j2];
            *_solution &= !a & !b | a & b;
        }
    }

private:
    bdd ***_p;
    int _n; int _k1; int _k2; int _j1; int _j2;
};


class Lim3 : public Limitation
{
public:
    enum class Side : int
    {
        kLeft,
        kRight
    };

public:
    explicit Lim3(bdd ***p, int n, Splice splice, int k1, int k2, int j1, int j2, Side side)
        : _p{p}, _n{n}, _splice{splice}, _k1{k1}, _k2(k2), _j1{j1}, _j2{j2}, _side{side}
    {}

    ~Lim3() override = default;

    void apply() override
    {
        if (!_solution) { std::abort(); }

        for (int p = 0; p < _n; ++p)
        {
            bdd a = _p[_k1][p][_j1];
            bdd b = toSide(p);
            *_solution &= !a & !b | a & b;
        }
    }

private:
    bdd ***_p;
    int _n; Splice _splice; Side _side; int _k1; int _k2; int _j1; int _j2;

private:

    bdd& toSide(int p)
    {   
        int sqrt_n = std::ceil(std::sqrt(_n));

        int p_x = p / sqrt_n;
        int p_y = p % sqrt_n;

        int q_y = (Side::kLeft == _side) ? p_y : p_y;
        int q_x = (Side::kLeft == _side) ? p_x - 1 : p_x + 1;
        
        // using positive modulo here
        switch (_splice)
        {
        case Splice::kHorizontal: q_x = (q_x % sqrt_n + sqrt_n) % sqrt_n; break;
        case Splice::kVertical: q_y = (q_y % sqrt_n + sqrt_n) % sqrt_n; break;
        default: break;
        }
        
        static bdd bdd_false_instance = bddfalse; 
        
        // check out of bounds
        if (q_y < 0 || q_y >= sqrt_n || q_x < 0 || q_x >= sqrt_n) { return bdd_false_instance; }

        int q = q_y * sqrt_n + q_x;
        
        return _p[_k2][q][_j2];
    }
};


class Lim4 : public Limitation
{
public:
    explicit Lim4(bdd ***p, int n, Splice splice, int k1, int k2, int j1, int j2)
        : _p{p}, _n{n}, _splice{splice}, _k1{k1}, _k2(k2), _j1{j1}, _j2{j2}
    {}

    ~Lim4() override = default;

    void apply() override
    {
        if (!_solution) { std::abort(); }
        
        Lim3 lim3_l(_p, _n, _splice, _k1, _k2, _j1, _j2, Lim3::Side::kLeft);
        bdd left;
        lim3_l.sub(&left);
        lim3_l.apply();

        Lim3 lim3_r(_p, _n, _splice, _k1, _k2, _j1, _j2, Lim3::Side::kRight);
        bdd right;
        lim3_r.sub(&right);
        lim3_r.apply();
        
        *_solution &= left | right;
    }

private:
    bdd ***_p;
    int _n; Splice _splice; int _k1; int _k2; int _j1; int _j2;
};

class Lim5 : public Limitation
{
public:
    explicit Lim5(bdd ***p , int n, int m)
        : _p{p}, _n{n}, _m{m}
    {}
    
    ~Lim5() override = default;

    void apply() override
    {
        if (!_solution) { std::abort(); }

        for (int k = 0; k < _m; ++k)
        {
            std::cout << k << std::endl;
            for (int i1 = 0; i1 < _n - 1; ++i1)
            {
                for (int i2 = i1 + 1; i2 < _n; ++i2)
                {
                    for (int j = 0; j < _n; ++j)
                    {
                        *_solution &= (!_p[k][i1][j] | !_p[k][i2][j]);
                    }
                }
            }
        }
    }

private:
    bdd ***_p;
    int _n; int _m;
};


class Lim6 : public Limitation
{
public:
    explicit Lim6(bdd ***p, int n, int m)
        : _p{p}, _n{n}, _m{m}
    {}
    
    ~Lim6() override = default;

    void apply() override
    {
        if (!_solution) { std::abort(); }
        
        for (int k = 0; k < _m; ++k)
        {
            for (int i = 0; i < _n; ++i)
            {
                bdd tmp = bddfalse;
                for (int j = 0; j < _n; ++j)
                {
                    tmp |= _p[k][i][j];
                }
                *_solution &= tmp;
            }
        }
    }

private:
    bdd ***_p;
    int _n; int _m;
};

} // namespace mlta
