import matplotlib
import pandas as pd
import matplotlib.pyplot as plt
import sys

df = pd.read_csv("benchmark.csv")

df['algorithm'] = df['name'].str.extract(r'/(MergeSort|DnCParallelMergeSort|TaskParallelMergeSort)/')
df['elements'] = df['name'].str.extract(r'/(\d+)/').astype(int)

plt.figure(figsize=(10, 6))

for algo in ['MergeSort', 'DnCParallelMergeSort', 'TaskParallelMergeSort']:
    subset = df[df['algorithm'] == algo].sort_values('elements')
    plt.plot(subset['elements'], subset['real_time'], marker='o', markersize=4, label=algo)

plt.xlabel('Number of Elements')
plt.ylabel('Time (ms)')
plt.title('Sorting Algorithms Comparison')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()