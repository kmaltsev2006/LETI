import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("benchmark.csv")

df['size'] = df['name'].str.extract(r'/(\d+)/').astype(int)
df['thread_type'] = df['name'].str.extract(r'/(MultiplyConcurrentlyStrassen|MultiplyConcurrently|MultiplyStrassen|Multiply)/')

plt.figure(figsize=(12, 8))

for thread_type in df['thread_type'].unique():
    subset = df[df['thread_type'] == thread_type].sort_values('size')
    plt.plot(subset['size'], subset['real_time'], 
             marker='o', markersize=6, linewidth=2, label=thread_type)

plt.xlabel('Matrix Size (N x N)')
plt.ylabel('Time (ms)')
plt.title('Matrix Multiplication Performance')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()