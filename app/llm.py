import os
import json
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMClient:
    def __init__(self, provider="openai"):
        self.provider = provider
        self.api_key = None
        
        if os.getenv("GEMINI_API_KEY"):
            self.provider = "gemini"
            self.api_key = os.getenv("GEMINI_API_KEY")
            genai.configure(api_key=self.api_key)
        elif os.getenv("OPENAI_API_KEY"):
            self.provider = "openai"
            self.api_key = os.getenv("OPENAI_API_KEY")
            self.client = OpenAI(api_key=self.api_key)
        else:
            print("Warning: No API key found (OpenAI or Gemini).")

    def generate_json(self, prompt, schema=None, model="gpt-3.5-turbo"):
        """
        Generates a JSON response from the LLM based on the prompt.
        """
        if self.provider == "gemini":
            return self._generate_gemini(prompt, schema)
        elif self.provider == "openai":
            return self._generate_openai(prompt, schema, model)
        else:
            return None

    def _generate_openai(self, prompt, schema, model):
        try:
            messages = [
                {"role": "system", "content": "You are a helpful assistant that generates JSON output."},
                {"role": "user", "content": prompt}
            ]
            
            if schema:
                messages[0]["content"] += f" Ensure the output follows this JSON schema: {json.dumps(schema)}"

            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Error generating JSON from OpenAI: {e}")
            raise e

    def _generate_gemini(self, prompt, schema):
        try:
            # Use gemini-flash-latest as a stable fallback
            model = genai.GenerativeModel('gemini-flash-latest')
            
            full_prompt = prompt
            if schema:
                full_prompt += f"\n\nOutput strictly in JSON format following this schema:\n{json.dumps(schema)}"

            response = model.generate_content(full_prompt)
            content = response.text
            
            # Clean up markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            return json.loads(content)
        except Exception as e:
            print(f"Error generating JSON from Gemini: {e}")
            raise e
