import React, { useState } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardContent, Textarea, Button, Alert, Badge } from '../components/ui';

const GTINVerificationPage = () => {
  const [gtinInput, setGtinInput] = useState('');
  const [results, setResults] = useState([]);
  const [allValid, setAllValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const gtins = gtinInput.split('\n').map(line => line.trim()).filter(line => line);

      if (gtins.length === 0) {
        setError('Please enter at least one GTIN code');
        return;
      }

      const response = await api.verifyGTINs(gtins);
      setResults(response.results);
      setAllValid(response.allValid);
      setHasResults(true);
    } catch (error) {
      setError('Error verifying GTINs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setHasResults(false);
    setAllValid(false);
    setGtinInput('');
    setError('');
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          GTIN Bulk Verification
        </h1>
        <p className="text-gray-600">
          Enter multiple GTIN codes (one per line) to verify if they are registered and valid in our system.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Enter GTIN Codes</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Textarea
                label="GTIN Codes (one per line)"
                value={gtinInput}
                onChange={(e) => setGtinInput(e.target.value)}
                rows={12}
                placeholder="37900123459171&#10;37900123459763&#10;37900123459529&#10;1234567890123"
                className="font-mono text-sm"
              />

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={!gtinInput.trim()}
                  className="flex-1"
                >
                  Verify GTINs
                </Button>

                {hasResults && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearResults}
                  >
                    Clear
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-500">
                <p className="mb-2 font-medium">Instructions:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Enter one GTIN code per line</li>
                  <li>GTIN codes should be 13-14 digits</li>
                  <li>Empty lines will be ignored</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>

        {hasResults && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Verification Results</h2>
              {allValid && (
                <Badge variant="success" className="text-sm">
                  ✓ All Valid
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.valid
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <span className="font-mono text-sm">{result.gtin}</span>
                    <Badge
                      variant={result.valid ? 'success' : 'danger'}
                      className="font-medium"
                    >
                      {result.valid ? '✓ Valid' : '✗ Invalid'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-4 mt-6 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span>Total GTINs:</span>
                    <span className="font-medium">{results.length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Valid GTINs:</span>
                    <span className="font-medium text-green-600">
                      {results.filter(r => r.valid).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Invalid GTINs:</span>
                    <span className="font-medium text-red-600">
                      {results.filter(r => !r.valid).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GTINVerificationPage;
