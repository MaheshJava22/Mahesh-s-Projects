import { useCallback, useEffect, useState } from 'react';

// Vite forwards these same-origin requests to the Spring Boot API in development.
const resources = {
  customers: {
    title: 'Customers', description: 'Keep customer details organized in one place.', singular: 'customer',
    key: 'cid', list: '/getcust', create: '/PostCust', update: '/updatecust/', remove: '/delcust/', name: 'cname', email: 'cemail',
    fields: [
      { name: 'cname', label: 'Full name', required: true, placeholder: 'e.g. Asha Patel' },
      { name: 'cemail', label: 'Email address', type: 'email', required: true, placeholder: 'asha@example.com' },
      { name: 'cphone', label: 'Phone number', type: 'tel', placeholder: '98765 43210' },
      { name: 'city', label: 'City', placeholder: 'Pune' },
      { name: 'state', label: 'State', placeholder: 'Maharashtra' },
    ],
    columns: [
      { label: 'Phone', value: (item) => item.cphone || '—' },
      { label: 'Location', value: (item) => [item.city, item.state].filter(Boolean).join(', ') || '—' },
    ],
  },
  staff: {
    title: 'Staff', description: 'Manage your team and their work details.', singular: 'staff member',
    key: 'sid', list: '/getstaff', create: '/Poststaff', update: '/updatestaff/', remove: '/delstaff/', name: 'sname', email: 'semail',
    fields: [
      { name: 'sname', label: 'Full name', required: true, placeholder: 'e.g. Sam Lee' },
      { name: 'semail', label: 'Email address', type: 'email', required: true, placeholder: 'sam@example.com' },
      { name: 'sphone', label: 'Phone number', type: 'tel', placeholder: '98765 43210' },
      { name: 'designation', label: 'Designation', placeholder: 'Sales associate' },
      { name: 'salary', label: 'Salary', type: 'number', placeholder: '50000' },
    ],
    columns: [
      { label: 'Phone', value: (item) => item.sphone || '—' },
      { label: 'Designation', value: (item) => item.designation || '—' },
      { label: 'Salary', value: (item) => item.salary || '—' },
    ],
  },
  admins: {
    title: 'Admins', description: 'Manage administrator contact records.', singular: 'admin',
    key: 'adminid', list: '/getadmin', create: '/Postadmin', update: '/updateadmin/', remove: '/deladmin/', name: 'adminname', email: 'email',
    fields: [
      { name: 'adminname', label: 'Full name', required: true, placeholder: 'e.g. Jordan Smith' },
      { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'jordan@example.com' },
      { name: 'password', label: 'Password', type: 'password', requiredOnCreate: true, placeholder: 'Enter a password' },
    ],
    columns: [],
  },
};

function encodeBasicAuth(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary);
}

async function request(path, { auth, ...options } = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...(auth ? { Authorization: `Basic ${auth}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = await response.text();
    try {
      const problem = JSON.parse(message);
      message = problem.message || problem.detail || problem.title || message;
    } catch {
      // Keep plain-text API errors as they are.
    }
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

function App() {
  const [resourceKey, setResourceKey] = useState('customers');
  const resource = resources[resourceKey];
  const [credentials, setCredentials] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: 'user', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadRecords = useCallback(async () => {
    if (!credentials) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await request(resource.list, { auth: credentials.auth });
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Could not load ${resource.title.toLowerCase()}. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [resource, credentials]);

  useEffect(() => {
    setForm(Object.fromEntries(resource.fields.map((field) => [field.name, ''])));
    setEditingId(null);
    setNotice('');
    loadRecords();
  }, [loadRecords, resource]);

  function changeResource(key) {
    setError('');
    setNotice('');
    setResourceKey(key);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const auth = encodeBasicAuth(loginForm.username, loginForm.password);
    try {
      await request(resource.list, { auth });
      setCredentials({ username: loginForm.username, auth });
      setLoginForm((current) => ({ ...current, password: '' }));
    } catch {
      setLoginError('Sign in failed. Check the username and password, and make sure the backend is running.');
    } finally {
      setLoggingIn(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(Object.fromEntries(resource.fields.map((field) => [field.name, ''])));
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const isEditing = editingId !== null;
    const payload = { ...form };
    // An empty password while editing means keep the current password.
    if (resourceKey === 'admins' && isEditing && !payload.password) delete payload.password;

    try {
      await request(isEditing ? `${resource.update}${editingId}` : resource.create, {
        auth: credentials.auth,
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      resetForm();
      setNotice(`${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} ${isEditing ? 'updated' : 'added'}.`);
      await loadRecords();
    } catch (err) {
      setError(`Could not save ${resource.singular}. ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(record) {
    setEditingId(record[resource.key]);
    setForm(Object.fromEntries(resource.fields.map((field) => [
      field.name,
      field.name === 'password' ? '' : record[field.name] ?? '',
    ])));
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteRecord(record) {
    const name = record[resource.name] || `this ${resource.singular}`;
    if (!window.confirm(`Delete ${name}?`)) return;
    setError('');
    setNotice('');
    try {
      await request(`${resource.remove}${record[resource.key]}`, { auth: credentials.auth, method: 'DELETE' });
      if (editingId === record[resource.key]) resetForm();
      setNotice(`${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} deleted.`);
      await loadRecords();
    } catch (err) {
      setError(`Could not delete ${resource.singular}. ${err.message}`);
    }
  }

  if (!credentials) {
    return (
      <main className="page-shell login-shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="SmartManage home">
            <span className="brand-mark">S</span><span>smart<span className="brand-light">manage</span></span>
          </a>
          <span className="topbar-label"><span className="status-dot" /> Secure sign in</span>
        </header>
        <section className="login-wrap" id="top">
          <form className="panel login-panel" onSubmit={handleLogin}>
            <p className="eyebrow">SMARTMANAGE</p>
            <h1>Sign in</h1>
            <p className="intro-copy">Sign in to open the customer, staff, and admin workspace.</p>
            {loginError && <div className="message message-error" role="alert">{loginError}</div>}
            <label className="field field-wide">
              <span>Username</span>
              <input value={loginForm.username} autoComplete="username" required onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))} />
            </label>
            <label className="field field-wide login-password-field">
              <span>Password</span>
              <input type="password" value={loginForm.password} autoComplete="current-password" required onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} />
            </label>
            <p className="login-help">The default username is <strong>user</strong>. Find the generated password in the Spring Boot terminal after startup.</p>
            <button className="button button-primary login-submit" type="submit" disabled={loggingIn}>
              {loggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SmartManage home">
          <span className="brand-mark">S</span><span>smart<span className="brand-light">manage</span></span>
        </a>
        <div className="topbar-actions">
          <span className="topbar-label"><span className="status-dot" /> Management workspace</span>
          <button className="button button-quiet logout-button" type="button" onClick={() => setCredentials(null)}>Sign out</button>
        </div>
      </header>

      <nav className="resource-tabs" aria-label="Choose records to manage">
        {Object.entries(resources).map(([key, item]) => (
          <button key={key} className={`resource-tab ${resourceKey === key ? 'resource-tab-active' : ''}`} type="button" onClick={() => changeResource(key)}>
            {item.title}
          </button>
        ))}
      </nav>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">{resource.title.toUpperCase()} MANAGEMENT</p>
          <h1>{resource.title}</h1>
          <p className="intro-copy">{resource.description}</p>
        </div>
        <div className="summary-card">
          <span className="summary-icon" aria-hidden="true">♙</span>
          <span><strong>{records.length}</strong><small>total {resource.title.toLowerCase()}</small></span>
        </div>
      </section>

      {(error || notice) && (
        <div className={`message ${error ? 'message-error' : 'message-success'}`} role="status">
          <span>{error || notice}</span>
          {error && <button className="message-close" onClick={() => setError('')} aria-label="Dismiss error">×</button>}
        </div>
      )}

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{editingId === null ? 'NEW RECORD' : `EDITING ${resource.singular.toUpperCase()} #${editingId}`}</p>
              <h2>{editingId === null ? `Add ${resource.singular}` : `Update ${resource.singular}`}</h2>
            </div>
            <span className="heading-icon" aria-hidden="true">＋</span>
          </div>
          <div className="form-fields">
            {resource.fields.map((field) => {
              const required = field.required || (field.requiredOnCreate && editingId === null);
              return (
                <label className="field field-wide" key={field.name}>
                  <span>{field.label}{required && <> <i>*</i></>}</span>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={form[field.name] ?? ''}
                    onChange={handleChange}
                    placeholder={field.name === 'password' && editingId !== null ? 'Leave blank to keep current password' : field.placeholder}
                    required={required}
                    minLength={field.name === 'password' ? 8 : undefined}
                    maxLength={field.name === 'password' ? 72 : undefined}
                    autoComplete={field.name === 'password' ? 'new-password' : 'off'}
                  />
                </label>
              );
            })}
          </div>
          <div className="form-actions">
            {editingId !== null && <button className="button button-quiet" type="button" onClick={resetForm}>Cancel</button>}
            <button className="button button-primary" type="submit" disabled={saving}>
              <span aria-hidden="true">{editingId === null ? '＋' : '✓'}</span>
              {saving ? 'Saving…' : editingId === null ? `Add ${resource.singular}` : 'Save changes'}
            </button>
          </div>
        </form>

        <section className="panel list-panel" aria-labelledby="list-heading">
          <div className="panel-heading list-heading">
            <div><p className="eyebrow">YOUR DIRECTORY</p><h2 id="list-heading">All {resource.title.toLowerCase()} <span className="count-pill">{records.length}</span></h2></div>
            <button className="button button-quiet refresh-button" type="button" onClick={loadRecords} disabled={loading}><span aria-hidden="true">↻</span> Refresh</button>
          </div>
          {loading ? (
            <div className="empty-state"><span className="loader" />Loading {resource.title.toLowerCase()}…</div>
          ) : records.length === 0 ? (
            <div className="empty-state"><span className="empty-icon" aria-hidden="true">♙</span><strong>No {resource.title.toLowerCase()} yet</strong><span>Add the first record using the form.</span></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{resource.singular}</th>{resource.columns.map((column) => <th key={column.label}>{column.label}</th>)}<th className="actions-heading">Actions</th></tr></thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record[resource.key]}>
                      <td><div className="customer-cell"><span className="avatar">{(record[resource.name] || '?').trim().charAt(0).toUpperCase()}</span><span className="customer-info"><strong>{record[resource.name] || `Unnamed ${resource.singular}`}</strong><small>{record[resource.email] || 'No email'}</small></span></div></td>
                      {resource.columns.map((column) => <td className="muted-cell" key={column.label}>{column.value(record)}</td>)}
                      <td><div className="row-actions"><button className="icon-button edit-button" type="button" onClick={() => startEditing(record)} aria-label={`Edit ${record[resource.name]}`} title="Edit">✎</button><button className="icon-button delete-button" type="button" onClick={() => deleteRecord(record)} aria-label={`Delete ${record[resource.name]}`} title="Delete">⌫</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="list-footer"><span className="status-dot" /> Connected to SmartManage API</div>
        </section>
      </section>
      <footer className="footer">SmartManage <span>·</span> {resource.title} records</footer>
    </main>
  );
}

export default App;
