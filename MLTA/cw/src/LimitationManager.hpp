#pragma once

#include <memory>
#include <vector>

#include "Limitation.hpp"

namespace mlta
{

class LimitationManager : public std::vector<std::unique_ptr<Limitation>>
{
public:
    
    template<typename LType, typename... Args>
    static std::unique_ptr<Limitation> create(Args&&... args)
    {
        return std::make_unique<LType>(std::forward<Args>(args)...);
    }

    template<typename LType, typename... Args>
    void addLimitation(Args&&... args)
    {
        this->push_back(
            std::move(create<LType>(std::forward<Args>(args)...))
        );
    }

};

} // namespace mlta