import { Injectable } from '@angular/core';

export type UserPermission = 'add' | 'edit' | 'delete';

export interface UserPermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RegisteredUser {
  name: string;
  username: string;
  gender: string;
  dob: string;
  password: string;
  role?: 'admin' | 'user';
  permissions?: UserPermissions;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usersStorageKey = 'registeredUsers';
  private readonly loginStorageKey = 'isUserLoggedIn';
  private readonly loginTimeStorageKey = 'loginTime';
  private readonly loggedInUsernameStorageKey = 'loggedInUsername';

  private readonly sessionDuration = 10 * 60 * 1000;

  private readonly adminUser: RegisteredUser = {
    name: 'System Administrator',
    username: 'admin',
    password: 'Admin@123',
    gender: 'Not specified',
    dob: '',
    role: 'admin',
    permissions: {
      add: true,
      edit: true,
      delete: true,
    },
  };

  public signup(user: RegisteredUser): boolean {
    const users = this.getRegisteredUsers();
    const username = user.username.trim().toLowerCase();

    if (
      username === this.adminUser.username ||
      users.some((existing) => existing.username.trim().toLowerCase() === username)
    ) {
      return false;
    }

    users.push({
      ...user,
      name: user.name.trim(),
      username: user.username.trim(),
      role: 'user',
      permissions: {
        add: false,
        edit: false,
        delete: false,
      },
    });

    this.saveRegisteredUsers(users);
    return true;
  }

  public login(username: string, password: string): boolean {
    const cleanUsername = username.trim().toLowerCase();

    let user: RegisteredUser | undefined;

    if (cleanUsername === this.adminUser.username && password === this.adminUser.password) {
      user = this.adminUser;
    } else {
      user = this.getRegisteredUsers().find(
        (candidate) =>
          candidate.username.toLowerCase() === cleanUsername && candidate.password === password,
      );
    }

    if (!user) {
      return false;
    }

    sessionStorage.setItem(this.loginStorageKey, 'true');
    sessionStorage.setItem(this.loginTimeStorageKey, Date.now().toString());
    sessionStorage.setItem(this.loggedInUsernameStorageKey, user.username);

    return true;
  }

  public initializeAuth(): void {
    this.isAuthenticated();
  }

  public isAuthenticated(): boolean {
    const loggedIn = sessionStorage.getItem(this.loginStorageKey);
    const loginTime = sessionStorage.getItem(this.loginTimeStorageKey);
    const username = sessionStorage.getItem(this.loggedInUsernameStorageKey);

    if (loggedIn !== 'true' || !loginTime || !username) {
      this.clearSession();
      return false;
    }

    const timestamp = Number(loginTime);

    if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0 ||
      Date.now() - timestamp >= this.sessionDuration
    ) {
      this.clearSession();
      return false;
    }

    const userExists =
      username.toLowerCase() === this.adminUser.username ||
      this.getRegisteredUsers().some((user) => user.username === username);

    if (!userExists) {
      this.clearSession();
      return false;
    }

    return true;
  }

  public getLoggedInUser(): RegisteredUser | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const username = sessionStorage.getItem(this.loggedInUsernameStorageKey);

    if (!username) {
      return null;
    }

    if (username.toLowerCase() === this.adminUser.username) {
      return { ...this.adminUser };
    }

    return this.getRegisteredUsers().find((user) => user.username === username) ?? null;
  }

  public isAdmin(): boolean {
    return this.getLoggedInUser()?.role === 'admin';
  }

  public hasPermission(permission: UserPermission): boolean {
    const user = this.getLoggedInUser();

    return user?.role === 'admin' || user?.permissions?.[permission] === true;
  }

  public getUsersForAccessManagement(): RegisteredUser[] {
    return this.getRegisteredUsers().map((user) => ({
      ...user,
      role: 'user',
      permissions: this.normalizePermissions(user.permissions),
      password: '',
    }));
  }

  public updateUserPermissions(username: string, permissions: UserPermissions): boolean {
    if (!this.isAdmin()) {
      return false;
    }

    const users = this.getRegisteredUsers();
    const index = users.findIndex((user) => user.username === username);

    if (index === -1) {
      return false;
    }

    users[index] = {
      ...users[index],
      role: 'user',
      permissions: this.normalizePermissions(permissions),
    };

    this.saveRegisteredUsers(users);
    return true;
  }

  public logout(): void {
    this.clearSession();
  }

  private normalizePermissions(permissions?: Partial<UserPermissions>): UserPermissions {
    return {
      add: permissions?.add === true,
      edit: permissions?.edit === true,
      delete: permissions?.delete === true,
    };
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.loginStorageKey);
    sessionStorage.removeItem(this.loginTimeStorageKey);
    sessionStorage.removeItem(this.loggedInUsernameStorageKey);
  }

  private getRegisteredUsers(): RegisteredUser[] {
    try {
      const stored = localStorage.getItem(this.usersStorageKey);

      if (!stored) {
        return [];
      }

      const parsed: unknown = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((user: RegisteredUser) => ({
        ...user,
        role: 'user',
        permissions: this.normalizePermissions(user.permissions),
      }));
    } catch {
      return [];
    }
  }

  private saveRegisteredUsers(users: RegisteredUser[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }
}
