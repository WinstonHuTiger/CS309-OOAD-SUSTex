## DRL Lecture 3: Q-learning (Basic Idea)

### 1. Critic

a. 输入一个actor，输出游戏结束之后累计的期望值

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573038332927.png" alt="1573038332927" style="zoom:50%;float:left" />

b. 用来衡量actor PI的好坏而不是state的好坏

#### How to estimate $V^\pi(s)$

##### 1. Monte-Carlo (MC) based approach

$V^\Pi(s)$当作一个网络，用regression problem的模型来拟合

##### 2. Temporal-difference (TD) approach

困难：一盘游戏所需要的事件太长

解决：不需要把游戏玩到底，通过上一个状态得到下一个状态的值

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573039357283.png" alt="1573039357283" style="zoom: 40%;float:left;" />

通过让$V^\Pi(S_t)-V^\Pi(S_{t+1})$的值与$r_t$的值接近来训练网络得到$V^\Pi$

##### 3. MC V.S. TD

有随机性：同样走到$S_a$最后得到的$G_a$的差别可能很大

如果每一步的反馈都有一个方差，那么加起来会很大：

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573039706750.png" alt="1573039706750" style="zoom:33%;float:left;" />

###### a. 所以MC得到的$G_a$的方差比较大

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573039781854.png" alt="1573039781854" style="zoom:40%;float:left;" />

###### b. TD虽然每一步r的方差比较小，但$V$的衡量不见得是准确的：

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573039872743.png" alt="1573039872743" style="zoom:40%;float:left;" />

###### c. 不同的方法对于同样的观测有不同的结果

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573040097881.png" alt="1573040097881" style="zoom:40%;float:left;" />

MC将$S_a$对$S_b$的影响考虑进去了而TD将其看作巧合 

### 2. Another Critic

##### Q function, 假设$\Pi$ 在stafte s强制采取action a，之后再让$\Pi$自己玩下去得到的累计期望值

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573040482470.png" alt="1573040482470" style="zoom:40%;float:left;" />

##### 左：连续，右：离散

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573040563679.png" alt="1573040563679" style="zoom:40%;float:left;" />

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573040688713.png" alt="1573040688713" style="zoom: 33%;float:left;" />

### 3. Another Way to use Critic: Q-Learning

假设已经有一个Policy $\Pi$ ，可以计算出一个Q函数的值，根据函数的值可以得出一个更好的Policy $\Pi^{'}$，再取代掉原来的Policy

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573109527199.png" alt="1573109527199" style="zoom:40%;float:left;" />

#### a. 什么叫做比较好的Policy?

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573109705131.png" alt="1573109705131" style="zoom:40%; float:left;" />

#### b. 有了Q怎么找$\Pi$?

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573109723034.png" alt="1573109723034" style="zoom:40%;float:left;" />

遍历所有的action，找到一个能够让Q的值最大的action，那么产生的$\Pi^{'}$ 在状态s的情况下会采取这个action

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573109988995.png" alt="1573109988995" style="zoom:33%;float:left" />

#### c. 证明找到的$\Pi^{'}$会更好

这里的$\Pi^{'}$与$\Pi$的区别是对于某一个状态s，$\Pi^{'}$会使得产生在$Q^{\Pi}$在任意状态s下使得函数值最大的action a

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573110124419.png" alt="1573110124419" style="zoom:40%;float:left;" />

###### 证明：

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573110236227.png" alt="1573110236227" style="zoom:40%;float:left;" />

###### 根据这个不等式可以一直推下去：

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573110917172.png" alt="1573110917172" style="zoom:40%;float:left;" />

### 4. Target Network

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573111134303.png" alt="1573111134303" style="zoom:40%;float:left;" />

##### a. 如果两个网络都在变动的话，训练出来的效果可能不好

因此我们需要将右边的网络固定住，只更新左边的网络。当左边的网络更新N次以后再将右边的网络替换掉

##### b. 最开始两个网络是相同的

### 5. Exploration

问题：如果在状态s时取样到$a_2$这个动作，而其他的动作没有被采样到，那么之后的动作都会选择$a_2$这个动作

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573111511537.png" alt="1573111511537" style="zoom:40%;float:left;" />

解决：需要机器有Exploration的机制（以一定的概率随机取样）

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573111903205.png" alt="1573111903205" style="zoom:40%;float:left" />

Epislon Greedy：类似模拟退火，开始的时候随机的概率大，之后概率逐渐变小

Boltzmann Exploration：用Q(s，a)的值产生一个分布，根据这个分布每个action的概率来进行选择

### 6. Replay Buffer

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573112311383.png" alt="1573112311383" style="zoom:40%; float:left;" />

#### a. 将Policy与环境做互动的资料放在一个Buffer里面

Replay Buffer里面的资料可能来自于不同的Policy

#### b. 为什么这样做？

（1）强化学习里面最花时间的是在与环境做互动，一些过去的资料可以放在Buffer里面被反复利用，提高数据的利用率

（2）训练的数据越多样化越好。如果都是来自同样的$\Pi$训练的效果可能不好

#### c. 用不同的Policy的数据会不会有问题？

不好解释，但理论上没有问题

### 7. 算法流程

<img src="C:\Users\HolldEaN\AppData\Roaming\Typora\typora-user-images\1573112832973.png" alt="1573112832973" style="zoom:40%;float:left;" />

