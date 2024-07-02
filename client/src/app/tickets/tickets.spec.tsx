import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tickets, { TicketsProps } from './tickets';
import { Ticket } from '@acme/shared-models';

const mockTickets: Ticket[] = [
  { id: 1, description: 'Test Ticket 1', assigneeId: 1, completed: false },
  { id: 2, description: 'Test Ticket 2', assigneeId: null, completed: false },
];

const defaultProps: TicketsProps = {
  tickets: mockTickets,
  onFetchTickets: jest.fn(),
  onSetPopup: jest.fn(),
};

describe('Tickets Component', () => {
  it('renders without crashing', () => {
    render(<Tickets {...defaultProps} />);
    expect(screen.getByText('Tickets')).toBeInTheDocument();
  });

  it('displays tickets', () => {
    render(<Tickets {...defaultProps} />);
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
  });

  it('filters tickets by assigned status', () => {
    render(<Tickets {...defaultProps} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'assigned' },
    });
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Ticket 2')).not.toBeInTheDocument();
  });

  it('opens add ticket panel', () => {
    render(<Tickets {...defaultProps} />);
    fireEvent.click(screen.getByText('Add'));
    expect(
      screen.getByPlaceholderText('Input description')
    ).toBeInTheDocument();
  });

  it('creates a new ticket', async () => {
    render(<Tickets {...defaultProps} />);
    fireEvent.click(screen.getByText('Add'));
    fireEvent.change(screen.getByPlaceholderText('Input description'), {
      target: { value: 'New Ticket' },
    });
    fireEvent.click(screen.getByText('OK'));
    expect(defaultProps.onSetPopup).toHaveBeenCalledWith(true);
  });
});
