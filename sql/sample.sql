insert into numbering (identifier, display_name) values ('O', 'Order Number');
insert into numbering (identifier, display_name) values ('M', 'Manifestation Identifier');
insert into numbering (identifier, display_name, prefix, suffix, is_padding, padding_length, padding_character, check_digit_rule)
 values ('I', 'Item Identifier', NULL, NULL, 1, 8, '0', 0);
insert into numbering (identifier, display_name, prefix, suffix, is_padding, padding_length, padding_character, check_digit_rule)
 values ('U', 'User Identifier', 'U', NULL,  1, 8, '0', 1);


