import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileEditForm from './ProfileEditForm';
// import { MockUserProfile } from '../../data/mockData';

const mockProfile = {
  id: 1,
  name: 'Jane Doe',
  title: 'Software Engineer',
  location: 'San Francisco, CA',
  avatar: '',
  bio: 'Test bio',
  socialLinks: {},
  connectionCount: 10,
  mutualConnections: 2,
  skills: [],
  experience: [],
  education: [],
  contactInfo: { email: 'jane@example.com', location: 'San Francisco, CA' },
};

describe('ProfileEditForm', () => {
  it('renders form fields and validates required fields', async () => {
    render(
      <ProfileEditForm profile={mockProfile} onSave={jest.fn()} onCancel={jest.fn()} />
    );
    // Name field required
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    // Email field required
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(
      <ProfileEditForm profile={mockProfile} onSave={jest.fn()} onCancel={jest.fn()} />
    );
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/Email format is invalid/i)).toBeInTheDocument();
  });

  it('shows image preview after upload', async () => {
    render(
      <ProfileEditForm profile={mockProfile} onSave={jest.fn()} onCancel={jest.fn()} />
    );
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    // Use data-testid for robust selection
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByAltText(/Preview/i)).toBeInTheDocument();
    });
  });

  it('shows loading and success states on submit', async () => {
    const onSave = jest.fn(() => Promise.resolve());
    render(
      <ProfileEditForm profile={mockProfile} onSave={onSave} onCancel={jest.fn()} />
    );
    fireEvent.click(screen.getByText(/Save/i));
    expect(screen.getByText(/Saving/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Saved successfully/i)).toBeInTheDocument());
  });

  it('shows error state if save fails', async () => {
    const onSave = jest.fn(() => Promise.reject(new Error('Failed to save')));
    render(
      <ProfileEditForm profile={mockProfile} onSave={onSave} onCancel={jest.fn()} />
    );
    fireEvent.click(screen.getByText(/Save/i));
    await waitFor(() => expect(screen.getByText(/Failed to save/i)).toBeInTheDocument());
  });
}); 