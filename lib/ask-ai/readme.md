# ASK-AI

This family of components are ment to simplify interaction with AI/GenAI tools like
LLM conversations, Image rekognition, Image generation


# Examples

```html
<button id="ask-btn">Send Question</button>

<ask-llm trigger="#ask-btn" on="click" model="claude-haiku"  target="#responses">
  <p>Hello there, how are you doing?</p>
</ask-llm>

<section id="responses">

</section>

```