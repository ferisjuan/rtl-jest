import { render, screen } from '@testing-library/react';
import RepositoriesSummary from './RepositoriesSummary';

test('displays information about the repository', () => {
  const repository = {
    forks: 10,
    language: 'JavaScript',
    open_issues: 3,
    stargazers_count: 5,
  }

  render(<RepositoriesSummary repository={repository} />);

  for (let key in repository) {
    const value = repository[key];
    const element = screen.getByText(new RegExp(value, 'i'));
    expect(element).toBeInTheDocument();
  }
})
