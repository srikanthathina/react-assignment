import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Check,
  Compass,
  Globe2,
  LogOut,
  MapPin,
  Plane,
  Search,
  Star,
} from "lucide-react";
import "./styles.css";

const AUTH_KEY = "wanderlog_session";
const COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca3,capital,region,subregion,population,area,flags,languages,currencies,timezones,continents,coatOfArms,maps";
const REQRES_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": "reqres-free-v1",
};

function normalizeCountry(country) {
  return {
    code: country.cca3,
    name: country.name?.common || "Unknown",
    officialName: country.name?.official || "Unknown",
    capital: country.capital?.[0] || "No capital listed",
    region: country.region || "Other",
    subregion: country.subregion || "Not listed",
    population: country.population || 0,
    area: country.area || 0,
    flag: country.flags?.svg || country.flags?.png,
    flagAlt: country.flags?.alt || `${country.name?.common} flag`,
    languages: country.languages ? Object.values(country.languages) : [],
    currencies: country.currencies
      ? Object.values(country.currencies).map((currency) => currency.name)
      : [],
    timezones: country.timezones || [],
    continents: country.continents || [],
    mapUrl: country.maps?.googleMaps,
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [session, setSession] = useLocalStorage(AUTH_KEY, null);
  const [selectedCode, setSelectedCode] = useState(null);
  const storageKey = session ? `wanderlog_lists_${session.email}` : "wanderlog_lists_guest";
  const [lists, setLists] = useLocalStorage(storageKey, { bucket: [], visited: [] });

  useEffect(() => {
    setSelectedCode(null);
  }, [session]);

  const logout = () => {
    setSession(null);
    setSelectedCode(null);
  };

  if (!session) {
    return <AuthScreen onAuth={setSession} />;
  }

  return (
    <Dashboard
      session={session}
      lists={lists}
      setLists={setLists}
      selectedCode={selectedCode}
      setSelectedCode={setSelectedCode}
      onLogout={logout}
    />
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "login" : "register";
      const response = await fetch(`https://reqres.in/api/${endpoint}`, {
        method: "POST",
        headers: REQRES_HEADERS,
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Try the test credentials.");
      }

      onAuth({
        email,
        token: data.token,
        id: data.id || "login-user",
        mode,
        signedInAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-lockup">
          <span className="brand-mark">
            <Globe2 size={28} />
          </span>
          <div>
            <p className="eyebrow">WanderLog</p>
            <h1>Your travel bucket list, powered by real-world data.</h1>
          </div>
        </div>
        <p className="hero-copy">
          Explore countries, save future destinations, and keep track of places you
          have already visited.
        </p>
        <div className="hero-stats">
          <span>250+ countries</span>
          <span>Protected app</span>
          <span>Persistent lists</span>
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication form">
        <div className="mode-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
          <p className="hint">Test login: eve.holt@reqres.in / any password</p>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ session, lists, setLists, selectedCode, setSelectedCode, onLogout }) {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      setStatus({ loading: true, error: "" });
      try {
        const response = await fetch(COUNTRIES_URL);
        if (!response.ok) throw new Error("Could not load countries. Please try again.");
        const data = await response.json();
        if (!cancelled) {
          setCountries(data.map(normalizeCountry));
          setStatus({ loading: false, error: "" });
        }
      } catch (err) {
        if (!cancelled) setStatus({ loading: false, error: err.message });
      }
    }

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(countries.map((country) => country.region))).sort()],
    [countries]
  );

  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) => {
        const matchesSearch =
          country.name.toLowerCase().includes(query.toLowerCase()) ||
          country.capital.toLowerCase().includes(query.toLowerCase());
        const matchesRegion = region === "All" || country.region === region;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === "population") return b.population - a.population;
        if (sortBy === "area") return b.area - a.area;
        return a.name.localeCompare(b.name);
      });
  }, [countries, query, region, sortBy]);

  const selectedCountry = countries.find((country) => country.code === selectedCode);
  const bucketCountries = countries.filter((country) => lists.bucket.includes(country.code));
  const visitedCountries = countries.filter((country) => lists.visited.includes(country.code));
  const coverage = bucketCountries.reduce((sum, country) => sum + country.population, 0);

  function toggleList(listName, code) {
    setLists((current) => {
      const exists = current[listName].includes(code);
      return {
        ...current,
        [listName]: exists
          ? current[listName].filter((item) => item !== code)
          : [...current[listName], code],
      };
    });
  }

  function markVisited(code) {
    setLists((current) => ({
      bucket: current.bucket.filter((item) => item !== code),
      visited: current.visited.includes(code) ? current.visited : [...current.visited, code],
    }));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="logo-button" onClick={() => setSelectedCode(null)}>
          <Compass size={24} />
          <span>WanderLog</span>
        </button>
        <div className="topbar-actions">
          <span className="user-pill">{session.email}</span>
          <button className="icon-button" title="Logout" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {selectedCountry ? (
        <CountryDetail
          country={selectedCountry}
          isBucket={lists.bucket.includes(selectedCountry.code)}
          isVisited={lists.visited.includes(selectedCountry.code)}
          onBack={() => setSelectedCode(null)}
          onBucket={() => toggleList("bucket", selectedCountry.code)}
          onVisited={() => markVisited(selectedCountry.code)}
        />
      ) : (
        <section className="dashboard-grid">
          <aside className="sidebar">
            <StatCard icon={<Plane />} label="Bucket List" value={lists.bucket.length} />
            <StatCard icon={<Check />} label="Visited" value={lists.visited.length} />
            <StatCard icon={<Globe2 />} label="World Coverage" value={formatNumber(coverage)} small />

            <ListPreview title="Want to Visit" countries={bucketCountries} onOpen={setSelectedCode} />
            <ListPreview title="Already Visited" countries={visitedCountries} onOpen={setSelectedCode} />
          </aside>

          <section className="explore-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Explore</p>
                <h2>Find your next destination</h2>
              </div>
              <span>{filteredCountries.length} countries</span>
            </div>

            <div className="filters">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by country or capital"
                />
              </label>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                {regions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="name">Sort by name</option>
                <option value="population">Sort by population</option>
                <option value="area">Sort by area</option>
              </select>
            </div>

            {status.loading && <p className="state-message">Loading countries...</p>}
            {status.error && <p className="error-message">{status.error}</p>}
            {!status.loading && !status.error && (
              <div className="country-grid">
                {filteredCountries.map((country) => (
                  <CountryCard
                    key={country.code}
                    country={country}
                    isBucket={lists.bucket.includes(country.code)}
                    isVisited={lists.visited.includes(country.code)}
                    onOpen={() => setSelectedCode(country.code)}
                    onBucket={() => toggleList("bucket", country.code)}
                    onVisited={() => markVisited(country.code)}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

function StatCard({ icon, label, value, small }) {
  return (
    <article className="stat-card">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong className={small ? "small-stat" : ""}>{value}</strong>
      </div>
    </article>
  );
}

function ListPreview({ title, countries, onOpen }) {
  return (
    <section className="list-preview">
      <h3>{title}</h3>
      {countries.length === 0 ? (
        <p className="empty-text">No countries yet.</p>
      ) : (
        countries.slice(0, 5).map((country) => (
          <button key={country.code} onClick={() => onOpen(country.code)}>
            <img src={country.flag} alt="" />
            <span>{country.name}</span>
          </button>
        ))
      )}
    </section>
  );
}

function CountryCard({ country, isBucket, isVisited, onOpen, onBucket, onVisited }) {
  return (
    <article className="country-card">
      <button className="card-media" onClick={onOpen}>
        <img src={country.flag} alt={country.flagAlt} />
      </button>
      <div className="card-body">
        <div>
          <h3>{country.name}</h3>
          <p>
            <MapPin size={14} /> {country.capital}
          </p>
        </div>
        <dl>
          <div>
            <dt>Region</dt>
            <dd>{country.region}</dd>
          </div>
          <div>
            <dt>Population</dt>
            <dd>{formatNumber(country.population)}</dd>
          </div>
        </dl>
        <div className="card-actions">
          <button className={isBucket ? "active action-button" : "action-button"} onClick={onBucket}>
            <Star size={16} /> Bucket
          </button>
          <button className={isVisited ? "active action-button" : "action-button"} onClick={onVisited}>
            <Check size={16} /> Visited
          </button>
        </div>
      </div>
    </article>
  );
}

function CountryDetail({ country, isBucket, isVisited, onBack, onBucket, onVisited }) {
  return (
    <section className="detail-view">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back to explore
      </button>
      <div className="detail-hero">
        <img src={country.flag} alt={country.flagAlt} />
        <div>
          <p className="eyebrow">{country.region}</p>
          <h1>{country.name}</h1>
          <p>{country.officialName}</p>
          <div className="detail-actions">
            <button className={isBucket ? "primary-button muted" : "primary-button"} onClick={onBucket}>
              <Star size={17} /> {isBucket ? "Remove from Bucket" : "Add to Bucket"}
            </button>
            <button className={isVisited ? "primary-button muted" : "primary-button"} onClick={onVisited}>
              <Check size={17} /> {isVisited ? "Visited" : "Mark Visited"}
            </button>
          </div>
        </div>
      </div>

      <div className="detail-facts">
        <Fact label="Capital" value={country.capital} />
        <Fact label="Population" value={formatNumber(country.population)} />
        <Fact label="Area" value={`${formatNumber(country.area)} km2`} />
        <Fact label="Subregion" value={country.subregion} />
        <Fact label="Languages" value={country.languages.join(", ") || "Not listed"} />
        <Fact label="Currencies" value={country.currencies.join(", ") || "Not listed"} />
        <Fact label="Timezones" value={country.timezones.slice(0, 4).join(", ")} />
        <Fact label="Continents" value={country.continents.join(", ")} />
      </div>

      {country.mapUrl && (
        <a className="map-link" href={country.mapUrl} target="_blank" rel="noreferrer">
          Open country in Google Maps
        </a>
      )}
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <article className="fact-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
