import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Button from '../src/components/Button';
import ColumnSelector from '../src/components/ColumnSelector';
import { YearField, ProjectField } from '../src/components/FormFields';
import InputLabel from '../src/components/InputLabel';
import LogoutButton from '../src/components/LogoutButton';
import Modal from '../src/components/Modal';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import NewEntryForm from '../src/components/NewEntryForm';
import NewSessionForm from '../src/components/NewSessionForm';
import Tab from '../src/components/Tab';
import { TableHeading } from '../src/components/TableHeading';
import TopNav from '../src/components/TopNav';
import DataInputModal from '../src/modals/DataInputModal';
import MergeSessionsModal from '../src/modals/MergeSessionsModal';

// Button tests
test('renders button text correctly', () => {
    render(<Button text="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
});

test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
});

// ColumnSelector Tests

const labels = ['Column 1', 'Column 2'];
const columns = { 'Column 1': { show: true }, 'Column 2': { show: false } };
const setShow = jest.fn();
const toggleColumn = jest.fn();

test('renders correctly when show is true', () => {
    render(
        <ColumnSelector
            show={true}
            labels={labels}
            columns={columns}
            setShow={setShow}
            toggleColumn={toggleColumn}
        />,
    );
    expect(screen.getByText('Column Selector')).toBeInTheDocument();
    labels.forEach((label) => {
        expect(screen.getByText((content) => content.startsWith(label))).toBeInTheDocument();
    });
});

test('calls setShow(false) when clicking outside the component', () => {
    const { container } = render(
        <ColumnSelector
            show={true}
            labels={labels}
            columns={columns}
            setShow={setShow}
            toggleColumn={toggleColumn}
        />,
    );

    fireEvent.mouseDown(container);
    expect(setShow).toHaveBeenCalledWith(false);
});

test('calls toggleColumn when checkbox is clicked', () => {
    render(
        <ColumnSelector
            show={true}
            labels={labels}
            columns={columns}
            setShow={setShow}
            toggleColumn={toggleColumn}
        />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(toggleColumn).toHaveBeenCalledWith('Column 1');
});

// YearField Tests
test('YearField renders with label', () => {
    render(<YearField year={2022} setYear={() => {}} layout="horizontal" />);
    expect(screen.getByText('Year:')).toBeInTheDocument();
});

// ProjectField Tests
test('ProjectField renders with options', () => {
    render(<ProjectField project="Gateway" setProject={() => {}} layout="horizontal" />);
    expect(screen.getByText('Project:')).toBeInTheDocument();
    expect(screen.getByText('Gateway')).toBeInTheDocument();
});

// InputLabel Tests
test('InputLabel displays label and input', () => {
    render(<InputLabel label="Test Label" input={<input />} layout="horizontal" />);
    expect(screen.getByText('Test Label:')).toBeInTheDocument();
});

// LogoutButton Tests
test('LogoutButton renders and calls auth.logout on click', () => {
    const auth = { logout: jest.fn(), loading: false };
    render(<LogoutButton auth={auth} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(auth.logout).toHaveBeenCalled();
});

// Modal Tests
test('Modal renders with title and text', () => {
    render(<Modal title="Test Modal" text="This is a test" showModal={true} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
});

//Entryform tests:
test('renders NewEntryForm with initial values', () => {
    render(<NewEntryForm setData={() => {}} />);
    expect(screen.getByText('Add New Critter Entry')).toBeInTheDocument();
    expect(screen.getByText('Choose a Critter')).toBeInTheDocument();
});

test('shows CritterForm when critter is selected', () => {
    render(<NewEntryForm setData={() => {}} />);
    fireEvent.click(screen.getByText('Turtle'));
    expect(screen.getByText('Add entry?')).toBeInTheDocument();
});

// New session form tests
test('renders NewSessionForm with project field', () => {
    render(
        <NewSessionForm session={{}} setField={() => {}} project="Gateway" setProject={() => {}} />,
    );
    expect(screen.getByText('Add New Session')).toBeInTheDocument();
});

//Tab tests
test('renders Tab with icon and text', () => {
    render(<Tab text="Lizard" icon={<div />} active={false} onClick={() => {}} />);
    expect(screen.getByText('Lizard')).toBeInTheDocument();
});

test('calls onClick when Tab is clicked', () => {
    const handleClick = jest.fn();
    render(<Tab text="Turtle" icon={<div />} active onClick={handleClick} />);
    fireEvent.click(screen.getByText('Turtle'));
    expect(handleClick).toHaveBeenCalled();
});

//TableHeading Tests
test('handles onClick event correctly', () => {
    const handleClick = jest.fn();
    render(
        <table>
            <thead>
                <tr>
                    <th>
                        <TableHeading
                            label="Name"
                            active
                            sortDirection="asc"
                            onClick={handleClick}
                        />
                    </th>
                </tr>
            </thead>
        </table>,
    );

    // Simulate click
    fireEvent.click(screen.getByText('Name'));
    expect(handleClick).toHaveBeenCalledTimes(1);
});

//TopNav tests:
test('renders TopNav with title and user controls', () => {
    const mockAuth = { user: { email: 'test@example.com' }, logout: jest.fn() };
    render(<TopNav title="Wildlife Tracker" auth={mockAuth} />);
    expect(screen.getByText('Wildlife Tracker')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
});

jest.mock('react-csv', () => ({
    CSVLink: ({ children }) => <div>{children}</div>,
}));

const closeModal = jest.fn();
const onCancel = jest.fn();

// DataInputModal Tests
test('renders DataInputModal with default tab', () => {
    render(<DataInputModal showModal={true} closeModal={closeModal} />);
    expect(screen.getByText('Data Input Tool')).toBeInTheDocument();
    expect(screen.getByText('New Data')).toBeInTheDocument();
});

test('switches to New Session tab in DataInputModal', async () => {
    render(<DataInputModal showModal={true} closeModal={closeModal} />);
    fireEvent.click(screen.getByText('New Session'));
    await waitFor(() => {
        expect(
            screen.getByText('Select a tab to create a new data entry or session.'),
        ).toBeInTheDocument();
    });
});

// MergeSessionsModal Tests
test('renders MergeSessionsModal with Data Form tab active', async () => {
    render(<MergeSessionsModal showModal={true} onCancel={onCancel} />);
    await waitFor(() => {
        expect(screen.getByText('Merge Session Tool')).toBeInTheDocument();
    });
});
