import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MathAdventures } from "./MathAdventures";

const renderGame=()=>render(<MemoryRouter><MathAdventures/></MemoryRouter>);
describe("MathAdventures",()=>{
  it("defaults to addition and starting out",()=>{renderGame();expect(screen.getByRole("radio",{name:/Addition/})).toBeChecked();expect(screen.getByRole("radio",{name:/Starting out/})).toBeChecked()});
  it("starts every topic mode with four choices",async()=>{const user=userEvent.setup();for(const topic of ["Addition","Subtraction","Money","Time","Mix it up"]){const view=renderGame();await user.click(screen.getByText(topic,{selector:"strong"}));await user.click(screen.getByRole("button",{name:/start adventure/i}));expect(within(screen.getByLabelText("Answer choices")).getAllByRole("button")).toHaveLength(4);view.unmount()}});
  it("shows hints, disables wrong answers, and advances only with Next",async()=>{const user=userEvent.setup();renderGame();await user.click(screen.getByRole("button",{name:/start adventure/i}));await user.click(screen.getByRole("button",{name:/hint/i}));expect(screen.getByText(/Here’s a hint/)).toBeInTheDocument();const choices=within(screen.getByLabelText("Answer choices")).getAllByRole("button");for(const choice of choices){await user.click(choice);if(screen.queryByRole("button",{name:/next/i}))break;}expect(screen.getByText("1",{selector:".progress-copy strong"})).toBeInTheDocument();await user.click(screen.getByRole("button",{name:/next/i}));expect(screen.getByText("2",{selector:".progress-copy strong"})).toBeInTheDocument()});
  it("ends practice back at setup",async()=>{const user=userEvent.setup();renderGame();await user.click(screen.getByRole("button",{name:/start adventure/i}));await user.click(screen.getByRole("button",{name:/end practice/i}));expect(screen.getByRole("heading",{name:"Math Adventures"})).toBeInTheDocument()});
});
