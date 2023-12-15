import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import RepositoriesListItem from './RepositoriesListItem';

// jest.mock('../tree/FileIcon', () => {
//   return () => {
//     return 'File Icon Component'
//   }
// })

function renderComponent() {
  const repository = {
    full_name: 'facebook/react',
    language: 'javascript',
    description: 'A library for building user interfaces',
    owner: {
      login: 'facebook',
    },
    name: 'react',
    html_url: 'https://github.com/facebook/react',
  }

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository }
}

test('shows a link to the github homepage for this repository', async () => {
  const { repository } = renderComponent()

  // this will get the icon which is a component that changes it's state
  await screen.findByRole('img', { name: 'javascript' }) // this is the preferred way
  // OR create a module mock (line 5 -> jest.mock(...))

  const link = screen.getByRole('link', {
    name: /github repository/i
  })

  expect(link).toHaveAttribute('href', repository.html_url)
})

test('shows a file icon with the appropiate icon', async () => {
  renderComponent()
  await screen.findByRole('img', { name: 'javascript' })
  const icon = screen.getByRole('img', { name: 'javascript' })

  expect(icon).toHaveClass('js-icon')
})

test('shows a link to the code editor page', async () => {
  const { repository } = renderComponent()
  await screen.findByRole('img', { name: 'javascript' })
  const link = screen.getByRole('link', {
    name: new RegExp(repository.owner.login, 'i')
  })

  expect(link).toHaveAttribute('href', `/repositories/${repository.full_name}`)
})
