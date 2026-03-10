import os
from dotenv import load_dotenv

# Core LangChain and AI imports
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

# 1. INITIALIZATION
load_dotenv()

current_dir = os.path.dirname(os.path.abspath(__file__))
PERSIST_DIRECTORY = os.path.join(current_dir, "..", "vector_store_db") 
LLM_REPO_ID = "meta-llama/Llama-3.1-8B-Instruct"

# 2. LOAD KNOWLEDGE BASE
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

retriever = None
if os.path.isdir(PERSIST_DIRECTORY):
    vector_store = Chroma(
        persist_directory=PERSIST_DIRECTORY, 
        embedding_function=embedding_model
    )
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
else:
    print(f"ERROR: Knowledge base not found at '{PERSIST_DIRECTORY}'")

# 3. INITIALIZE LLM
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
hf_llm = HuggingFaceEndpoint(
    repo_id=LLM_REPO_ID,
    task="conversational",
    temperature=0.1, 
    max_new_tokens=1024,
    huggingfacehub_api_token=hf_token
)
chat_model = ChatHuggingFace(llm=hf_llm)

# ==========================================
# STEP 1: DEFINE AGENT TOOLS
# ==========================================

def tool_search_textbook(query):
    """Tool 1: Searches the academic Vector DB."""
    if not retriever: return "Error: Database unavailable."
    docs = retriever.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])

def tool_report_formatting():
    """Tool 2: Strict rules for generating Lab Reports / Experiments."""
    return """
    CRITICAL INSTRUCTION: The user wants a formal ACADEMIC REPORT or EXPERIMENT.
    You MUST format the output using these sections:
    1. TITLE: [Experiment Name]
    2. AIM: [Objective of the study]
    3. THEORY: [Key concepts involved]
    4. PROCEDURE/SQL CODE: [Step-by-step implementation]
    5. CONCLUSION: [Summary of learning]

    Keep the tone highly professional and structured.
    """

def tool_diagram_instructions(query):
    """Tool 3: Strict rules for Mermaid diagrams to prevent render errors."""
    return """
    CRITICAL INSTRUCTION: Generate ONLY Mermaid.js code.
    Rules:
    1. Start with ```mermaid and end with ```.
    2. Use `erDiagram` at the top.
    3. Attributes MUST be one-per-line: Entity { type name } 
    4. NEVER use commas.
    5. Ensure all relationship labels are in quotes, e.g., : "belongs to".
    """

# ==========================================
# STEP 2: DEFINE THE ROUTER (UPDATED)
# ==========================================

router_template = """
You are the logic engine of a DBMS Tutor. Classify the user's intent.
1. CREATE_REPORT: If asking for an experiment, lab report, or formal documentation.
2. DRAW_DIAGRAM: If asking for a visual, E-R model, or schema.
3. CHECK_HISTORY: If asking about progress.
4. SEARCH_TEXTBOOK: For general definitions, SQL, or concepts.

User Query: {question}

Return ONLY the tool name.
"""

router_prompt = ChatPromptTemplate.from_template(router_template)
router_chain = router_prompt | chat_model | StrOutputParser()

# ==========================================
# STEP 3: DEFINE FINAL GENERATION
# ==========================================

advanced_prompt_template = """
You are an Academic AI Tutor for DBMS. Use the CONTEXT to answer the QUESTION.

--- CONTEXT ---
{context}

--- STRATEGY ---
Mode: {agent_strategy} | Target Level: {skill_level}

RULES:
- If 'Report Generation Mode', follow Lab Report structure strictly.
- If 'Visual Generation Mode', output ONLY mermaid code.
- If 'Academic mode', explain clearly for a {skill_level} level student.

QUESTION: {question}
Final Answer:
"""

final_prompt = ChatPromptTemplate.from_template(advanced_prompt_template)
final_chain = final_prompt | chat_model | StrOutputParser()

# ==========================================
# STEP 4: EXECUTOR
# ==========================================

def get_agentic_response(user_query, chat_history, skill_level="beginner"):
    try:
        decision = router_chain.invoke({"question": user_query}).strip()
        print(f"Agent Decision: {decision}")
        
        context = ""
        strategy = ""
        
        if "CREATE_REPORT" in decision:
            knowledge = tool_search_textbook(user_query)
            rules = tool_report_formatting()
            context = f"{rules}\n\n--- CONTENT DATA ---\n{knowledge}"
            strategy = "Report Generation Mode"
        elif "DRAW_DIAGRAM" in decision:
            knowledge = tool_search_textbook(user_query) 
            rules = tool_diagram_instructions(user_query)
            context = f"{rules}\n\n--- TOPIC DATA ---\n{knowledge}"
            strategy = "Visual Generation Mode"
        else:
            context = tool_search_textbook(user_query)
            strategy = "Academic Explanation Mode"
            
        response = final_chain.invoke({
            "context": context,
            "question": user_query,
            "skill_level": skill_level,
            "agent_strategy": strategy
        })
        
        return response.split("Human:")[0].strip()

    except Exception as e:
        print(f"RAG Agent Error: {e}")
        return "An error occurred while the AI was thinking."

if __name__ == "__main__":
    # Test CLI
    while True:
        inp = input("You: ")
        if inp.lower() in ["exit", "quit"]: break
        print(f"\nAI:\n{get_agentic_response(inp, [], 'beginner')}\n")