
import { useState } from "react";
import {
  Flower2,
  Leaf,
  FlaskConical,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  LoaderCircle,
  LayoutDashboard,
  BookOpen,
  Clock3,
  Database,
  BrainCircuit,
  Microscope,
  Info,
} from "lucide-react";
import "./App.css";

const initialValues = {
  sepal_length: 5.1,
  sepal_width: 3.5,
  petal_length: 1.4,
  petal_width: 0.2,
};

const measurements = [
  {
    key: "sepal_length",
    label: "Sepal length",
    min: 4,
    max: 8,
    step: 0.1,
    unit: "cm",
  },
  {
    key: "sepal_width",
    label: "Sepal width",
    min: 2,
    max: 4.5,
    step: 0.1,
    unit: "cm",
  },
  {
    key: "petal_length",
    label: "Petal length",
    min: 1,
    max: 7,
    step: 0.1,
    unit: "cm",
  },
  {
    key: "petal_width",
    label: "Petal width",
    min: 0.1,
    max: 2.5,
    step: 0.1,
    unit: "cm",
  },
];

const speciesInfo = {
  setosa: {
    title: "Iris Setosa",
    color: "#52866b",
    description:
      "A distinctive variety with relatively short petals and sepals.",
  },
  versicolor: {
    title: "Iris Versicolor",
    color: "#8a70bc",
    description:
      "An intermediate variety with medium-sized petals.",
  },
  virginica: {
    title: "Iris Virginica",
    color: "#cf8a4e",
    description:
      "Often the largest of these three Iris varieties, with longer petals.",
  },
};

const experimentResults = [
  { name: "K-Nearest Neighbors", short: "KNN", accuracy: "100%", correct: 30 },
  { name: "Decision Tree", short: "Decision Tree", accuracy: "96.67%", correct: 29 },
  { name: "Support Vector Machine", short: "SVM (RBF)", accuracy: "96.67%", correct: 29 },
  { name: "Logistic Regression", short: "Logistic Regression", accuracy: "93.33%", correct: 28 },
  { name: "Random Forest", short: "Random Forest", accuracy: "90%", correct: 27 },
];

function App() {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("analyzer");
  const [predictionHistory, setPredictionHistory] = useState([]);

  function updateValue(key, value) {
    setValues((current) => ({
      ...current,
      [key]: Number(value),
    }));

    setResult(null);
    setError("");
  }

  function resetForm() {
    setValues({ ...initialValues });
    setResult(null);
    setError("");
  }

  async function predict() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
      }

      const data = await response.json();
      const predictedSpecies = String(
        data.predicted_species
      ).toLowerCase();

      if (!speciesInfo[predictedSpecies]) {
        throw new Error("The API returned an unknown species.");
      }

      setResult(predictedSpecies);

      setPredictionHistory((history) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          species: predictedSpecies,
          measurements: { ...values },
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        },
        ...history,
      ].slice(0, 10));
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        "We couldn't reach the prediction API. Check that FastAPI is running at http://127.0.0.1:8000 and that CORS is configured."
      );
    } finally {
      setLoading(false);
    }
  }

  const flower = result ? speciesInfo[result] : null;

  function navigate(page) {
    setActivePage(page);
    setError("");
  }

  function renderSidebarButton(page, icon, label) {
    const Icon = icon;

    return (
      <button
        key={page}
        className={`nav-item ${activePage === page ? "active" : ""}`}
        onClick={() => navigate(page)}
        aria-current={activePage === page ? "page" : undefined}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  }

  function renderAnalyzer() {
    return (
      <>
        <section className="hero">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} />
              YOUR BOTANICAL LAB
            </div>

            <h1>
              Every flower tells
              <br />
              a <em>different story.</em>
            </h1>

            <p>
              Explore the Iris dataset with machine learning.
              Enter four measurements and let your trained model
              identify the flower species.
            </p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <Flower2 size={106} strokeWidth={0.8} />
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-sparkle">✳</span>
          </div>
        </section>

        <div className="section-heading">
          <div>
            <span className="section-kicker">01 / INPUT</span>
            <h2>Flower measurements</h2>
            <p>Adjust the values to describe your flower.</p>
          </div>

          <button className="reset-button" onClick={resetForm}>
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <section className="workspace-grid">
          <div className="measurement-card">
            {measurements.map((item, index) => (
              <div className="measurement" key={item.key}>
                <div className="measurement-top">
                  <label htmlFor={item.key}>{item.label}</label>

                  <span className="measurement-number">
                    {values[item.key].toFixed(1)}{" "}
                    <small>{item.unit}</small>
                  </span>
                </div>

                <input
                  id={item.key}
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={values[item.key]}
                  onChange={(event) =>
                    updateValue(item.key, event.target.value)
                  }
                  style={{
                    "--range-color": [
                      "#588b70",
                      "#8d79b7",
                      "#d28b55",
                      "#588b70",
                    ][index],
                  }}
                />

                <div className="range-labels">
                  <span>{item.min} cm</span>
                  <span>{item.max} cm</span>
                </div>
              </div>
            ))}

            <div className="input-note">
              <Leaf size={17} />
              <span>
                Measurements are in centimetres. Use realistic values
                for the best interpretation.
              </span>
            </div>

            <button
              className="predict-button"
              onClick={predict}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  Identify flower
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
          </div>

          <aside className="result-card">
            <div className="result-header">
              <span className="section-kicker">02 / PREDICTION</span>
              <span className="live-pill">
                <span />
                LIVE
              </span>
            </div>

            {flower ? (
              <div className="result-content">
                <div
                  className="result-flower"
                  style={{ color: flower.color }}
                >
                  <Flower2 size={66} strokeWidth={1.1} />
                </div>

                <p className="result-caption">YOUR FLOWER IS</p>
                <h3>{flower.title}</h3>
                <p className="result-description">
                  {flower.description}
                </p>

                <div className="success-note">
                  <CheckCircle2 size={17} />
                  Prediction returned by your trained KNN model.
                </div>
              </div>
            ) : (
              <div className="empty-result">
                <div className="empty-flower">
                  <Flower2 size={54} strokeWidth={1} />
                </div>

                <h3>Meet your flower</h3>
                <p>
                  Your prediction will appear here once you analyze
                  the measurements.
                </p>

                <div className="empty-divider" />

                <div className="mini-stat">
                  <span>INPUT FEATURES</span>
                  <strong>04</strong>
                </div>

                <div className="mini-stat">
                  <span>SPECIES TO IDENTIFY</span>
                  <strong>03</strong>
                </div>
              </div>
            )}

            <div className="result-footer">
              <span>POWERED BY</span>
              <strong>scikit-learn · KNN</strong>
            </div>
          </aside>
        </section>

        <section className="bottom-note">
          <div className="note-icon">
            <FlaskConical size={20} />
          </div>

          <div>
            <strong>A small model, a real ML workflow.</strong>
            <p>
              This interface sends your measurements to FastAPI,
              which runs the saved preprocessing and classification
              pipeline.
            </p>
          </div>
        </section>
      </>
    );
  }

  function renderWorkspace() {
    return (
      <section className="info-page">
        <span className="section-kicker">YOUR WORKSPACE</span>

        <h1>
          ML <em>overview.</em>
        </h1>

        <p className="page-intro">
          A snapshot of your Iris classification project and
          the predictions you've made in this session.
        </p>

        <div className="overview-grid">
          <article className="overview-card">
            <span>DATASET SIZE</span>
            <strong>150</strong>
            <p>Flower samples</p>
          </article>

          <article className="overview-card">
            <span>INPUT FEATURES</span>
            <strong>04</strong>
            <p>Numerical measurements</p>
          </article>

          <article className="overview-card">
            <span>SPECIES</span>
            <strong>03</strong>
            <p>Classification classes</p>
          </article>

          <article className="overview-card">
            <span>YOUR PREDICTIONS</span>
            <strong>{predictionHistory.length}</strong>
            <p>In this browser session</p>
          </article>
        </div>

        <div className="info-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent predictions</h2>
              <p>Your latest model outputs.</p>
            </div>
            <Clock3 size={20} />
          </div>

          {predictionHistory.length === 0 ? (
            <div className="history-empty">
              <Flower2 size={32} />
              <p>No predictions yet.</p>
              <span>
                Open the Flower Analyzer to make your first prediction.
              </span>
            </div>
          ) : (
            predictionHistory.map((item) => (
              <div className="history-row" key={item.id}>
                <div className="history-flower">
                  <Flower2
                    size={22}
                    color={speciesInfo[item.species].color}
                  />
                </div>

                <div className="history-description">
                  <strong>{speciesInfo[item.species].title}</strong>
                  <p>
                    {item.date} · {item.time}
                  </p>
                  <span>
                    Sepal {item.measurements.sepal_length.toFixed(1)} ×{" "}
                    {item.measurements.sepal_width.toFixed(1)} cm
                    {" · "}
                    Petal {item.measurements.petal_length.toFixed(1)} ×{" "}
                    {item.measurements.petal_width.toFixed(1)} cm
                  </span>
                </div>

                <span className="history-tag">Predicted</span>
              </div>
            ))
          )}
        </div>

        <div className="info-panel workspace-model-panel">
          <div className="panel-heading">
            <div>
              <h2>Current ML experiment</h2>
              <p>The model comparison from your earlier notebook.</p>
            </div>
            <BrainCircuit size={22} />
          </div>

          <p className="experiment-disclaimer">
            These are the previously observed test-set results,
            not live performance measurements.
          </p>

          {experimentResults.map((item) => (
            <div className="experiment-row" key={item.name}>
              <div className="experiment-label">
                <span>{item.name}</span>
                <strong>{item.accuracy}</strong>
              </div>

              <div className="experiment-track">
                <div
                  className="experiment-fill"
                  style={{
                    width: `${Number(item.accuracy.replace("%", ""))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="predict-button"
          onClick={() => navigate("analyzer")}
        >
          Open flower analyzer
          <ArrowRight size={18} />
        </button>
      </section>
    );
  }

  function renderAbout() {
    return (
      <section className="info-page">
        <span className="section-kicker">MODEL DOCUMENTATION</span>

        <h1>
          Behind the <em>prediction.</em>
        </h1>

        <p className="page-intro">
          Explore how our classifier transforms four flower
          measurements into a species prediction.
        </p>

        <div className="about-hero-card">
          <div className="about-icon">
            <BrainCircuit size={30} />
          </div>

          <div>
            <span className="section-kicker">CLASSIFICATION ALGORITHM</span>
            <h2>K-Nearest Neighbors</h2>
            <p>
              KNN is a supervised learning algorithm that classifies
              a new flower by looking at similar flowers in its
              training data.
            </p>
          </div>
        </div>

        <div className="about-grid">
          <article className="info-panel">
            <div className="about-panel-icon">
              <Database size={21} />
            </div>
            <h2>Our dataset</h2>
            <p>
              The Iris dataset contains 150 samples, four numerical
              measurements, and three species classes.
            </p>
            <div className="about-stat">
              <strong>150</strong>
              <span>total samples</span>
            </div>
          </article>

          <article className="info-panel">
            <div className="about-panel-icon">
              <Microscope size={21} />
            </div>
            <h2>Feature scaling</h2>
            <p>
              Our saved pipeline uses StandardScaler before KNN.
              Scaling matters because KNN relies on distances
              between samples.
            </p>
            <div className="about-stat">
              <strong>4</strong>
              <span>input features</span>
            </div>
          </article>
        </div>

        <div className="info-panel about-section">
          <h2>How does KNN work?</h2>

          <div className="process-step">
            <span>01</span>
            <div>
              <strong>Receive the measurements</strong>
              <p>
                The API receives sepal length, sepal width,
                petal length, and petal width.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>02</span>
            <div>
              <strong>Scale the features</strong>
              <p>
                StandardScaler transforms the measurements using
                the statistics learned from the training data.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>03</span>
            <div>
              <strong>Find nearby examples</strong>
              <p>
                KNN finds the three nearest training examples
                using the configured distance metric.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>04</span>
            <div>
              <strong>Return the predicted species</strong>
              <p>
                The model predicts the class based on the nearest
                neighbors and sends the result to the interface.
              </p>
            </div>
          </div>
        </div>

        <div className="info-panel about-section">
          <div className="panel-heading">
            <div>
              <h2>Earlier model comparison</h2>
              <p>Results recorded during your test-set experiment.</p>
            </div>
            <FlaskConical size={21} />
          </div>

          <div className="experiment-disclaimer">
            <Info size={16} />
            <span>
              The test set contains only 30 samples. Accuracy on
              this split is not a guarantee of generalization.
              Use cross-validation for a more robust comparison.
            </span>
          </div>

          {experimentResults.map((item) => (
            <div className="experiment-row" key={item.name}>
              <div className="experiment-label">
                <span>{item.name}</span>
                <strong>{item.accuracy}</strong>
              </div>

              <div className="experiment-track">
                <div
                  className="experiment-fill"
                  style={{
                    width: `${Number(item.accuracy.replace("%", ""))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="info-panel about-section">
          <h2>What this model can and cannot do</h2>
          <p>
            This project demonstrates a three-class classifier
            trained on the classic Iris dataset. It is a learning
            project, not a general-purpose plant identification
            system.
          </p>
          <p>
            Predictions can be unreliable for measurements far
            outside the training distribution. The result describes
            the model's classification, not a guaranteed botanical
            identification.
          </p>
        </div>

        <button
          className="predict-button"
          onClick={() => navigate("analyzer")}
        >
          Try the model
          <ArrowRight size={18} />
        </button>
      </section>
    );
  }

  const pageTitles = {
    workspace: "Workspace",
    analyzer: "Flower analyzer",
    about: "About the model",
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            navigate("workspace");
          }}
        >
          <span className="brand-icon">
            <Flower2 size={24} />
          </span>
          <span>
            flora<span className="brand-light">.ai</span>
          </span>
        </a>

        <p className="nav-label">WORKSPACE</p>

        {renderSidebarButton(
          "workspace",
          LayoutDashboard,
          "Workspace"
        )}

        {renderSidebarButton(
          "analyzer",
          Flower2,
          "Flower analyzer"
        )}

        {renderSidebarButton(
          "about",
          BookOpen,
          "About the model"
        )}

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>ML engine</strong>
            <p>Local API integration</p>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {pageTitles[activePage]}
          </div>

          <div className="top-status">
            <span />
            IRIS CLASSIFIER
          </div>
        </header>

        <div className="content">
          {activePage === "workspace" && renderWorkspace()}
          {activePage === "analyzer" && renderAnalyzer()}
          {activePage === "about" && renderAbout()}

          <footer>
            <span>FLORA.AI · LEARNING LAB</span>
            <span>
              Built with curiosity <span className="footer-heart">♥</span>
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default App;
