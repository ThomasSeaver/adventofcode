use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::fs;
use std::time::Instant;

#[derive(Copy, Clone, Debug, PartialEq)]
struct GridSpot {
    arrival_cost: u32,
    visited: bool,
}

#[derive(Copy, Clone, Eq, PartialEq)]
struct PathStep {
    cost_from_origin: u32,
    pos: usize,
}

impl Ord for PathStep {
    fn cmp(&self, other: &Self) -> Ordering {
        other
            .cost_from_origin
            .cmp(&self.cost_from_origin)
            .then_with(|| self.pos.cmp(&other.pos))
    }
}

impl PartialOrd for PathStep {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn main() {
    // Parse file input
    let file_content = fs::read_to_string("i.txt").expect("Something went wrong reading the file");

    // Split to different input sets
    let inputs: Vec<&str> = file_content.split("\n***\n").collect();

    // Perform functions on each input set
    for input in inputs.iter() {
        // Time measure
        let start = Instant::now();
        println!("P1");
        p1(input);
        let duration = start.elapsed();
        println!("Time elapsed: {:?}", duration);

        let start = Instant::now();
        println!("P2");
        p2(input);
        let duration = start.elapsed();
        println!("Time elapsed: {:?}", duration);
    }
}

fn p1(input: &str) {
    let mut grid_map = HashMap::new();
    let row_length = input.split('\n').next().expect("Should pass row").len();

    let mut queue: BinaryHeap<PathStep> = BinaryHeap::new();

    for (row_index, row) in input.split('\n').enumerate() {
        for (chr_index, chr) in row.chars().enumerate() {
            let digit = chr.to_digit(10).expect("bad digit");
            let spot = GridSpot {
                arrival_cost: digit,
                visited: false,
            };
            grid_map.insert(row_length * row_index + chr_index, spot);
        }
    }

    queue.push(PathStep {
        cost_from_origin: 0,
        pos: 0,
    });

    loop {
        let cheapest = queue.pop().expect("queue shouldn't run dry");

        if cheapest.pos == grid_map.len() - 1 {
            println!("Cheapest path has cost {}", cheapest.cost_from_origin);
            break;
        }

        let current = grid_map
            .get_mut(&cheapest.pos)
            .expect("position should be valid");

        if current.visited {
            continue;
        }
        current.visited = true;

        if cheapest.pos + row_length < grid_map.len() {
            let down = grid_map
                .get_mut(&(cheapest.pos + row_length))
                .expect("position should be valid");

            if !down.visited {
                queue.push(PathStep {
                    cost_from_origin: down.arrival_cost + cheapest.cost_from_origin,
                    pos: cheapest.pos + row_length,
                })
            }
        }

        if cheapest.pos + 1 < grid_map.len() && (cheapest.pos + 1) % row_length != 0 {
            let right = grid_map
                .get_mut(&(cheapest.pos + 1))
                .expect("position should be valid");

            if !right.visited {
                queue.push(PathStep {
                    cost_from_origin: right.arrival_cost + cheapest.cost_from_origin,
                    pos: cheapest.pos + 1,
                })
            }
        }

        if cheapest.pos >= row_length {
            let up = grid_map
                .get_mut(&(cheapest.pos - row_length))
                .expect("position should be valid");

            if !up.visited {
                queue.push(PathStep {
                    cost_from_origin: up.arrival_cost + cheapest.cost_from_origin,
                    pos: cheapest.pos - row_length,
                })
            }
        }

        if cheapest.pos >= 1 && (cheapest.pos - 1) % row_length != row_length - 1 {
            let left = grid_map
                .get_mut(&(cheapest.pos - 1))
                .expect("position should be valid");

            if !left.visited {
                queue.push(PathStep {
                    cost_from_origin: left.arrival_cost + cheapest.cost_from_origin,
                    pos: cheapest.pos - 1,
                })
            }
        }
    }
}

fn p2(input: &str) {
    let mut tiled_input: Vec<Vec<u32>> = input
        .split('\n')
        .map(|r| {
            r.chars()
                .map(|c| c.to_digit(10).expect("Grid should be numbers"))
                .collect()
        })
        .collect();

    let mut vertical_addition: Vec<Vec<u32>> = vec![];
    for add in 1..5 {
        for row in tiled_input.iter() {
            let clone = row
                .iter()
                .map(|c| {
                    if (c + add) >= 10 {
                        c + add - 9
                    } else {
                        c + add
                    }
                })
                .collect();
            vertical_addition.push(clone);
        }
    }
    tiled_input.append(&mut vertical_addition);

    tiled_input = tiled_input
        .iter()
        .map(|r| {
            let mut new_row: Vec<u32> = vec![];
            for add in 0..5 {
                let mut clone: Vec<u32> = r
                    .iter()
                    .map(|c| {
                        if (c + add) >= 10 {
                            c + add - 9
                        } else {
                            c + add
                        }
                    })
                    .collect();
                new_row.append(&mut clone)
            }
            return new_row;
        })
        .collect();

    let stringified_input = tiled_input
        .iter()
        .map(|r| {
            r.iter()
                .map(|c| c.to_string())
                .collect::<Vec<String>>()
                .concat()
                + &String::from("\n")
        })
        .collect::<Vec<String>>()
        .concat();

    p1(&stringified_input);
}
