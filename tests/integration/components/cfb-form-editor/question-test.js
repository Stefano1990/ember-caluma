import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, blur, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import graphqlError from "dummy/tests/helpers/graphql-error";

module("Integration | Component | cfb-form-editor/question", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders", async function(assert) {
    assert.expect(4);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "text"
    });

    await render(hbs`{{cfb-form-editor/question slug='test-slug'}}`);

    assert.dom("[name=label]").hasValue("Test Label");
    assert.dom("[name=slug]").hasValue("test-slug");
    assert.dom("[name=slug]").isDisabled();
    assert.dom("[name=type]").hasValue("text");
  });

  test("it validates", async function(assert) {
    assert.expect(2);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "text"
    });

    await render(hbs`{{cfb-form-editor/question slug='test-slug'}}`);

    await fillIn("[name=label]", "");
    await blur("[name=label]");

    assert.dom("[data-test-submit]").isDisabled();
    assert.dom("[name=label] + span").hasText("Label can't be blank");
  });

  test("it can edit a question", async function(assert) {
    assert.expect(5);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "text"
    });

    this.set("afterSubmit", question => {
      assert.ok(question);
      assert.equal(question.label, "Test Label 1");
      assert.equal(question.type, "number");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question slug='test-slug' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=label]", "Test Label 1");
    await fillIn("[name=type]", "number");

    await click("[data-test-submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can handle errors", async function(assert) {
    assert.expect(1);

    this.server.create("question", { slug: "test-slug" });

    this.set("afterSubmit", () => assert.step("after-submit"));

    // edit question
    await render(
      hbs`{{cfb-form-editor/question
        slug='test-slug'
        on-after-submit=(action afterSubmit)
      }}`
    );

    this.server.post("/graphql", () => graphqlError("saveQuestion"), 200);
    await click("[data-test-submit]");

    assert.verifySteps([]);
  });
});
