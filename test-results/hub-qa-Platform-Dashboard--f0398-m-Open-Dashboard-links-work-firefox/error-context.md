# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "Welcome back" [level=1] [ref=e6]
        - generic [ref=e7]: Enter your email and password to sign in
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]:
            - text: Email
            - textbox "Email" [ref=e12]:
              - /placeholder: you@example.com
          - generic [ref=e13]:
            - generic [ref=e14]:
              - text: Password
              - link "Forgot password?" [ref=e15] [cursor=pointer]:
                - /url: /reset-password
            - textbox "Password" [ref=e17]:
              - /placeholder: ••••••••
        - generic [ref=e18]:
          - button "Sign In" [ref=e19]
          - paragraph [ref=e20]:
            - text: Don't have an account?
            - link "Sign up" [ref=e21] [cursor=pointer]:
              - /url: /sign-up
```