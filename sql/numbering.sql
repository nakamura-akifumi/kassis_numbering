create table numbering (
 id serial NOT NULL PRIMARY KEY,
 identifier VARCHAR(16) NOT NULL,
 grp VARCHAR(16),
 display_name VARCHAR(32),
 prefix VARCHAR(16),
 suffix VARCHAR(16),
 is_padding INT DEFAULT 0,
 padding_length INT DEFAULT 0,
 padding_character VARCHAR (16),
 check_digit_rule INT DEFAULT 0,
 last_value DECIMAL (12) NOT NULL DEFAULT 0
)
