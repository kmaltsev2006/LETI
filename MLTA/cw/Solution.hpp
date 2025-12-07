#pragma once

#include <bdd.h>
#include <vector>
#include <memory>

#include "Limitation.hpp"
#include "LimitationManager.hpp"
#include "mlta_types.hpp"
#include "utils.hpp"

namespace mlta
{

class Solution
{

public:
    explicit Solution(int n, int m)
        : _n{n}
        , _m{m}
        , _p{nullptr}
        , _splice{Splice::kNone}
    {   
        bdd_init(100'000'000, 10'000'000);
        bdd_setvarnum(_n * _m * ceilLog2(_n));

        _p = new bdd**[_m];
        for (int k = 0; k < _m; ++k)
        {
            _p[k] = new bdd*[_n];
            for (int i = 0; i < _n; ++i)
            {
                _p[k][i] = new bdd[_n];
            }
        }
        
        populate();
        setLimitations();
    }

    ~Solution()
    {
        for (int k = 0; k < _m; ++k)
        {
            for (int i = 0; i < _n; ++i)
            {
                delete[] _p[k][i];
            }
            delete[] _p[k];
        }
        delete[] _p;

        bdd_done();
    }

    // non-copyable
    Solution(const Solution& other) = delete;
    Solution operator=(const Solution& other) = delete;

    // non-moveable
    Solution(Solution&& other) = delete;
    Solution& operator=(Solution&& other) = delete;

    void solve()
    {
        bdd solution = bddtrue;
        for (auto &lim : _limitations)
        {
            lim->sub(&solution);
            lim->apply();
        }

        std::cout << bdd_satcount(solution) << std::endl;
    }
    

private:
    int _n;
    int _m;
    bdd ***_p;
    LimitationManager _limitations;
    Splice _splice;

private:

    void populate()
    {
        int log2_n = ceilLog2(_n);

        for (int k = 0; k < _m; ++k)
        {
            for (int i = 0; i < _n; ++i)
            {
                for (int j = 0; j < _n; ++j)
                {
                    _p[k][i][j] = bddtrue;
                    for (int t = 0; t < log2_n; ++t)
                    {
                        int idx = log2_n * _m * i + log2_n * k + t;
                        _p[k][i][j] &= ((j >> t) & 1) ? bdd_ithvar(idx) : bdd_nithvar(idx);
                    }
                }
            }
        }
    }

    void setLimitations()
    {
        _limitations.addLimitation<Lim1>(_p, 0, 0, 0);
        _limitations.addLimitation<Lim1>(_p, 0, 2, 1);
        _limitations.addLimitation<Lim1>(_p, 1, 4, 3);
        _limitations.addLimitation<Lim1>(_p, 2, 6, 0);
        _limitations.addLimitation<Lim1>(_p, 3, 1, 2);
        _limitations.addLimitation<Lim1>(_p, 0, 3, 2);
        _limitations.addLimitation<Lim1>(_p, 1, 5, 0);
        _limitations.addLimitation<Lim1>(_p, 2, 7, 1);

        // _limitations.addLimitation<Lim2>(_p, 9, 0, 1, 1, 1);
        // _limitations.addLimitation<Lim2>(_p, 9, 0, 2, 2, 1);
        // _limitations.addLimitation<Lim2>(_p, 9, 1, 2, 3, 0);
        // _limitations.addLimitation<Lim2>(_p, 9, 1, 3, 0, 2);

        // _limitations.addLimitation<Lim3>(_p, 9, _splice, 0, 1, 0, 2, Lim3::Side::kLeft);
        // _limitations.addLimitation<Lim3>(_p, 9, _splice, 1, 1, 3, 4, Lim3::Side::kLeft);
        // _limitations.addLimitation<Lim3>(_p, 9, _splice, 0, 3, 4, 3, Lim3::Side::kLeft);
        // _limitations.addLimitation<Lim3>(_p, 9, _splice, 3, 0, 3, 1, Lim3::Side::kRight);
        // _limitations.addLimitation<Lim3>(_p, 9, _splice, 3, 1, 0, 3, Lim3::Side::kRight);

        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 3, 2, 1, 0);
        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 3, 2, 2, 1);
        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 3, 0, 4, 2);
        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 0, 1, 4, 4);
        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 0, 3, 3, 0);
        // _limitations.addLimitation<Lim4>(_p, 9, _splice, 2, 1, 3, 4);
            
        _limitations.addLimitation<Lim5>(_p, _n, _m);
        _limitations.addLimitation<Lim6>(_p, _n, _m);
    }
};

} // namespace mlta
