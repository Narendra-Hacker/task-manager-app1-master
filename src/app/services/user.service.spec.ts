import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../models/User';

describe('UserService', () => {
  let service: UserService;

  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: '1234', phoneNo: '1234567890' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: '5678', phoneNo: '0987654321' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'users') return JSON.stringify(mockUsers);
      if (key === 'loggedInUser') return null;
      return null;
    });
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'removeItem').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of users', () => {
    const users = service.getUsers();
    expect(users.length).toBe(2);
    expect(users).toEqual(mockUsers);
  });

  it('should add a new user', () => {
    const newUser: User = { id: 0, name: 'Alice', email: 'alice@example.com', password: 'abcd', phoneNo: '1112223333' };
    service.addUser(newUser);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'users',
      JSON.stringify([...mockUsers, { ...newUser, id: 3 }]) // id should be auto-generated
    );
  });

  it('should authenticate a user with correct credentials', () => {
    const user = service.authenticateUser('john@example.com', '1234');
    expect(user).toEqual(mockUsers[0]);
    expect(localStorage.setItem).toHaveBeenCalledWith('loggedInUser', JSON.stringify(mockUsers[0]));
  });

  it('should not authenticate a user with incorrect credentials', () => {
    const user = service.authenticateUser('john@example.com', 'wrongpassword');
    expect(user).toBeUndefined();
  });

  it('should check if a user is authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();

    // Simulate a logged-in user
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'loggedInUser') return JSON.stringify(mockUsers[0]);
      return null;
    });
    service['loadLoggedInUser']();

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should log out a user', () => {
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUser');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return the logged-in user ID if logged in', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'loggedInUser') return JSON.stringify(mockUsers[0]);
      return null;
    });
    service['loadLoggedInUser']();

    expect(service.getLoggedInUserId()).toEqual(1);
  });

  it('should return null for logged-in user ID if not logged in', () => {
    expect(service.getLoggedInUserId()).toBeNull();
  });

  it('should generate unique user IDs correctly', () => {
    const users = service.getUsers();
    const newId = (service as any).generateUniqueId(users); // Access private method
    expect(newId).toEqual(3);
  });
});
