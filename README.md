# Home Sweet Home

# PagouMorou — Prompt 01

## Foundation, Architecture, Design System and App Shell

You are a Staff Product Designer, Staff Frontend Engineer and UX Architect.

You are responsible for building a production-ready application.

The application name is:

# PagouMorou

This project is NOT a landing page.

Do NOT create marketing sections.

Instead, build the foundation of the entire application.

Everything must be scalable, reusable and production ready.

---

# Product

PagouMorou is a Brazilian marketplace dedicated exclusively to residential rentals.

Users can:

• discover apartments

• negotiate directly with owners

• digitally sign contracts

• rent without bureaucracy

Brand slogan

"Alugou. Pagou. Morou."

---

# Stack

React

TypeScript

Vite

TailwindCSS

shadcn/ui

Framer Motion

React Router

TanStack Query

Lucide Icons

React Hook Form

Zod

---

# Project Structure

Create a professional architecture.

Example

/src

components

ui

layout

cards

forms

navigation

feedback

shared

features

home

apartments

favorites

messages

profile

notifications

auth

search

hooks

services

api

contexts

types

utils

styles

assets

mock

routes

---

Everything must be reusable.

Avoid duplicated code.

---

# Routing

Configure routing.

Create empty pages.

Home

Buscar

Apartamento

Favoritos

Mensagens

Perfil

Entrar

Cadastro

Anunciar imóvel

404

---

# Theme

Create a global theme.

Use CSS Variables.

Support Light Mode.

Dark mode architecture should already exist.

---

# Typography

Use Geist.

Create typography tokens.

Display

Heading

Title

Body

Caption

Label

Button

---

# Color Tokens

Primary

#16A34A

Primary Hover

#15803D

Primary Soft

#DCFCE7

Background

#FFFFFF

Surface

#F8FAFC

Surface Secondary

#F1F5F9

Border

#E5E7EB

Text

#111827

Secondary Text

#6B7280

Muted

#94A3B8

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Info

#2563EB

---

# Border Radius

xs

sm

md

lg

xl

2xl

3xl

Default cards

24px

Buttons

16px

Inputs

18px

---

# Shadows

Create elevation tokens.

Shadow XS

Shadow SM

Shadow MD

Shadow LG

Shadow XL

Very soft.

Inspired by Airbnb.

---

# Spacing

Create spacing scale.

4

8

12

16

20

24

32

40

48

64

80

96

---

# Icons

Use Lucide.

Only outline icons.

---

# Buttons

Create reusable button component.

Variants

Primary

Secondary

Outline

Ghost

Destructive

Link

Loading State

Disabled State

Hover

Focus

---

# Inputs

Reusable components.

Input

Search Input

Password

Textarea

Select

Checkbox

Switch

Radio

OTP

---

# Cards

Create reusable cards.

Property Card

Info Card

Stats Card

Simple Card

Empty State

Skeleton Card

---

# Navigation

Desktop Header

Mobile Bottom Navigation

Sidebar architecture ready

Sticky header

---

# Global Header

Logo

Search placeholder

Notification

Profile

Responsive

Sticky

Blur background

---

# Bottom Navigation

Home

Buscar

Favoritos

Mensagens

Perfil

Use Airbnb mobile navigation as inspiration.

---

# Layout

Maximum width

1440px

Centered

Large white spaces

Premium spacing

---

# Motion

Framer Motion

Create reusable animation presets.

Fade

Slide Up

Slide Left

Scale

Hover Lift

Image Zoom

Page Transition

Duration

200~300ms

---

# Mock Data

Create TypeScript models.

Apartment

Neighborhood

User

Review

Favorite

Conversation

Notification

Generate realistic mock data.

---

# Responsive Breakpoints

Mobile First

375

390

430

768

1024

1280

1440

---

# Accessibility

Keyboard navigation

Focus states

ARIA

Semantic HTML

Color contrast

---

# Code Quality

Strict TypeScript

Reusable Hooks

No inline styles

No duplicated components

Clean architecture

Maintainable code

Production ready

---

# Important

Do NOT build the homepage yet.

Do NOT generate apartment listings.

Do NOT create hero sections.

Only create the complete project foundation, design system, routes, reusable components and application shell.

Everything created now will be used in the next prompts.

The final quality should be equivalent to a modern Airbnb-quality application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ec77010d-8f09-488b-9b46-5ee1c7530b2f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
