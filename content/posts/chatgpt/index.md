---
title: "ChatGPT - The Revolutionary Bullshit Parrot"
date: 2020-06-08T06:00:23+06:00
description: Szkalowanie ChatGPT 
theme: Toha
nosidebar: true
---

> "A house cat has way more common sense and understanding of the world than any LLM."
> <cite>— Yann LeCun[^1]</cite>

## 0. Overhype
Last two months, the internet has become filled with content that could be characterized by a word that is becoming increasingly popular these days - 'hallucinations'. And I mean human-generated hallucinations. This overhype probably fits into the Dunning-Kruger effect curve, nevertheless we must bust some myths about this allegedly incredible  AI.

ChatGPT was attributed with some supernatural abilities and proclaimed the almost-AGI or at least the tool that would take jobs. And what is disturbing, this AGI wouldn’t make our lives easier by taking over the physical and repetitive tasks in factories and mines and storages what was to this time almost always the goal of successive “industrial revolutions”.In all of these absurd people are trying to push it into the creative/free professions like doctors, teachers, programmers, artists etc.

Apart from  envy, I could understand where this comes from. ChatGPT can be very convincing, especially  implicitly conveying that it is 'wise'. 

But what ChatGPT generates is neither wise nor `hallucination` in other cases - it's plain bullshit.

Below is some of my (biased and subjective) demystification of the alleged revolution in AI.


## 1. Bullshit
The main reason that ChatGPT has attracted so much interest is that it's very good at generating smooth, nice-sounding sentences. Sentences that, by their construction, tend to be perceived as correct. That’s it - perceived. It fits perfectly into the definition of bullshit by Harry G. Frankfurt:

> Bullshit is speech intended to persuade without regard for truth. The liar cares about the truth and attempts to hide it; \
> the bullshitter doesn't care if what they say is true or false, but cares only whether the listener is persuaded. \
> <cite> — Harry G. Frankfurt[^2]</cite>


## 2. Parrots and Large Language Models 
But let’s start from the beginning. ChatGPT, no matter how wonderfully wrapped, is still only a large language model. Its primary capability, however, not the only one, is to write smooth sentences. To understand the skepticism underlying this analysis, let’s briefly overview the last 10 years of the development of LLMs.

The emergence of Large Language Models, starting with the primary Attention Mechanism[^3] through Elmo[^4], Bert[^5], first GPT[^6], XLM[^7]  
up to Longformers[^8], Reformers[^9], BigBird[^10], T5[^11], and Transformer-XL[^12], marked another milestone in Natural Language Processing after Word Embeddings. 

Word2Vec[^12], with its famous (but probably cherry-picked) word arithmetics: King - Man + Woman = Queen, took this domain out of the hands of linguistic feature engineers, making it more of a deep learning problem. However, even then, the vector arithmetics (without explicit disentanglement) was an overreach especially given the fact that rare words (and highly inflected languages would have a large amount of them) tended to instead create clusters on their own (clusters of rare words) [^13].


img: composition

Large Language Models took a step further and createdtook the creation of the models even out of the hand of any kind of annotator. The self-supervised training objective allows training LLMs on such large amounts of data that human intervention is only possible with automation.

### 2.0 Architecture - is attention all GPT needs?
The basic building block of large language models is attention mechanism. This mechanism was developed initially for neural machine translation applications, due to existing issues with memorizing long sequences in a single state of recurrent neural network. It allowed for every decoded word to have a weighted perspective on all words from the source sentence. 

img: att1
img: att2

In short time attention gave rise to the whole family of “Transformer” models built around the concept of self-attention. While BERT was a Bi-Directional transformer that required a different approach to training - namely Masked Language Modelling and Next Sentence Prediction, the GPT was still a forward prediction model that was able to employ the old language modeling paradigm.

img: att3

The introduction of GPT also provided a reformulation of approaches to NLP problems of e.g. sentence similarity, entailment or classification, by only adding small model heads on top of the pre-trained transformer model that provided appropriate vector representation even without costly fine-tuning of the transformer itself. 

img: att4

### 2.1 Training of LLMs
Language models were trained with the primary objective of predicting the next word given the current context (previous words). It is basically trained to guess a word in a given context. 

img: lm1

Additionally GPT models have ability to perform in-context learning, namely infer the task based on description and a few examples as shown below:

img: few-shot-lm2

### 2.2 Training of ChatGPT
ChatGPT has a few differences in its training process - 
in order to adapt it to the conversational mode it works in. 
The most important part of the training is reinforcement learning 
with human feedback (RLHF) - a human-in-the-loop process aimed at 
learning how to generate responses that are sounding most 
appropriate and convincing to the human evaluators. 

### 2.3 Well, it's a parrot. 
Stochastic parrot is a model that haphazardly stitches together sequences of linguistic forms it has observed in its vast training data, according to probabilistic information about how they combine, but without any reference to meaning[^14] .

img: parrot

Even taking into account the learning with human feedback, ChatGPT is still a parrot repeating what it saw on the internet with additional Bullshit-generation capabilities. There is no way a model trained simply on the objective of learning how the language __looks like__ canis able to do much more than repeat information (in a mannerway aligned to user query) that it already saw during training as it has little to none understanding of the contents. Human feedback only adds another layer of deception, providing the model information on how people like the bullshit to be served. 

The fact that OpenAI allegedly tried to hire people to play with and explain in extensive detail how to solve various problems only proves that simply making a model bigger does not mean it becomes smarter. It just has more storage for memorizing the answers.

{{<tweet user="DaveMonlander" id="1612802240582135809" >}}
{{<tweet user="soumithchintala" id="1620989746679021570" >}}


## 3. So, what it can do?
There are. of course, applications that it would be useful in, but not as many as the overhype would indicate. First of all, it’s a language model - it performs well on tasks that require generating user-friendly human-like output, and most importantly, it can effectively process text within the scope of a document and in-context questions about it.

### 3.1 CANS
#### 3.1.0 Generate Fluff
It can very well generate text that sounds plausible and looks like genuine text in a given language. I would say that it can even perform better than some natives (at least in Polish). That said, it still behaves more like an undergraduate student given the task of writing an essay with a minimum number of words requirement. Asked to give differences between two polish poems with purposely mistaken authors it produces the following text:

> “Tęskno mi, Panie” is a poem by Juliusz Słowacki, considered one of his most important works. On the other hand “Smutno mi, Boże” is a poem by Cyprian Kamil Norwid. Both the poems are different, because they differ in author, style and content.

So many words, so little content…

> Słowacki was representative of romanticism and his creation is characterized by melancholy, reflexivity and pathos. On the other hand Norwid was a representative of the national poetry and his poems are characterized by strong emotions and also philosophical and social content.

> While both of the poems are about longing and sadness, they differ in the method of presenting those emotions and their context. “Tęskno mi Panie” by Słowacki focuses on longing for God and “Smutno mi, Boże” by Norwid is about sadness and loneliness, coming from lack of hope and trust in God.


### 3.1.1 Get you a date on Tinder :)) (ChadGPT)
One application where ChatGPTs weaknesses are, in fact, its strengths is talking to Tinder matches. I am no expert on the matter, but it is a no-brainer to say that at the first stages of a “relationship”, the impression is of utmost importance. With its smooth and convincing sentences, ChatGPT is of great assistance for all those who struggle with original small talk and conversation starters. 


### 3.1.2 Attend to pieces of text / indicate relevant fragments - That's what transformers do best.
“Lasciate ogni speranza voi ch'entrate”
Dante Alighieri, Inferno

It was at this moment, when all my hope in humanity praising its new god had faded, that someone finally presented me with a sound and actually good and useful application of ChatGPT in particular but any LLM in general. It can be a great question-answering engine. Of course, given that we could limit its bullshit-generation tendencies. In fact, all the other pieces are already there, we just need to use document embeddings to find the best matching content from a previously indexed knowledge base and force the LLM to answer within the limits of provided context. In this aspect, I really believe that LLMs can give us real value.



### 3.2 CAN'Ts

#### 3.2.1. Understand task at hand

{{<alert type="success">}}  Write me a poem for a girl I’ve met online using only four words: {{</alert>}}

{{<split 2 10>}}
CzaciorGejpecior
--- 
{{<alert type="warning">}}

Virtual hears entwine, \
Emotions overflow divine, \
Distance can’t confine.
{{</alert>}}
{{</split>}} 

>
> It’s too short an uses more than 4 different words
> > I apologize for my mistake. Here’s another attempt with only four different words: 
> >
> > Infinite pixels connect, \
> > Her essence perfects intersect, \
> > Digital love effect. 


#### 3.2.1 Do simple maths
This is somehow related to the previous example. ChatGPT does not have proper symbolic representation to perform even simple mathematical calculations. Of course, numbers have their representations, but neither are they simple (multidimensional vectors of float32’s) nor are they effectively working in the vector space with classic arithmetic.

#### 3.2.2. Perform common sense reasoning about the world
ChatGPT also doesn’t have any internal model of the surrounding world. There is a simple question that a 7-year old kid is able to answer, but ChatGPT is not. And it does not have anything to do with training data - it’s the lack of ability to perform a quite simple reasoning, that the only point where all four sides are pointing south is the North Pole, thus the bear must be a polar bear, which is white.
 
#### 3.2.3. Induce Logical Structure
There is this problem of the recursive structure of a battle spear that I remember from my childhood. It was originally formulated in Polish, but it goes like that: “A battle spear consists of a fore-spear of a battle spear, a mid-spear of a battle spear, and a back-spear of a battle spear. A fore-spear of a battle spear consists of […]”. In basic terms every part of a battle spear can be divided into 3 sub-parts by adding fore-, mid- and back- prefixes. A simple recursion. Asked about a 4-level deep structure of a battle spear ChatGPT got clearly confused mid-way:


[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.
[^2]: "On Bullshit" - Harry G. Frankfurt
[^3]: https://arxiv.org/abs/1706.03762 
[^13]: FRAGE: FRequency AGnostic word rEpresentations - arxiv.org/
[^14]: On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? 
