#  Smart AI Assistant for DBMS

*A smart AI tutor that helps students learn DBMS, practice SQL, and generate lab reports.*

## Application Previews

1] landing page 

The welcome screen to start your AI tutoring session.

<img width="1906" height="872" alt="image" src="https://github.com/user-attachments/assets/3b45ec30-dd76-4de9-adda-3d299262982d" />

2] Chat Interface Page

The main chat area to ask theory questions, see ER diagrams, and download reports.

<img width="1908" height="867" alt="image" src="https://github.com/user-attachments/assets/412bf38a-629c-4e51-974a-1c354c30126d" />

3] Sql Sandbox

A coding space for students to practice SQL queries and get instant AI feedback to fix their errors.

<img width="1908" height="872" alt="image" src="https://github.com/user-attachments/assets/8e7519eb-7091-433d-a967-585c91f8e283" />

##  Project Overview
The **Smart AI Assistant for DBMS** is an intelligent, Agentic RAG powered tutoring system specifically engineered for  students to solve doubts in Dbms subject. Traditional Large Language Models often hallucinate technical facts and fail to provide the structured documentation required in academic environments. This project solves that problem by combining the reasoning capabilities of generative AI with the strict factual accuracy of verified university textbooks.

Acting as a virtual lab assistant, it actively evaluates student SQL queries to provide pedagogical hints, dynamically renders complex Database Management System schemas (like ER diagrams) in the browser, and seamlessly compiles user session history into perfectly formatted, downloadable PDF and Word lab reports. 

## System Architecture

<img width="5922" height="6319" alt="image_1" src="https://github.com/user-attachments/assets/19ace4bf-0698-4494-a492-f6d2800e1ec6" />

1. **User Input:** Natural language query via React UI.
2. **Router Agent:** Analyzes intent (Theory or Code or Report Related Question).
3. **Retrieval:** Performs Cosine Similarity search on the local ChromaDB for factual grounding.
4. **Synthesis:** LLM processes retrieved context to generate the response.
5. **Output:** Formatted markdown, syntax-highlighted SQL, or downloadable PDF via FPDF.

## Key Features

* **Agentic Intent Routing:** Automatically classifies student queries to route them to the correct tool (Theory Retrieval, SQL Evaluation, or Report Generation).
* **Zero-Hallucination Theory (RAG):** Uses a local ChromaDB vector store populated with verified DBMS textbooks to ensure factual, syllabus-aligned answers.
* **Active SQL Tutoring:** Evaluates incorrect student SQL queries, explains the logical error (e.g., misusing `WHERE` instead of `HAVING`), and provides hints.
* **Multimodal Visual Outputs:** Converts database schemas into visual ER Diagrams instantly using Mermaid.js.
* **1-Click Lab Reports:** Compiles session history and code into formatted, downloadable PDF or Word academic reports.
* **Session Persistence:** Maintains context across user interactions using a MySQL relational database to log chat history.

## Technology Stack

**Frontend:** React.js, Tailwind CSS, Mermaid.js  
**Backend & AI Engine:** Python, Flask, LangChain, Generative LLMs (Llama 3 / Gemini), Embedding Models  
**Databases:** ChromaDB (Vector Store), MySQL (Relational DB)  

